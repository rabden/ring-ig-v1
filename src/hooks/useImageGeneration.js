import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import { toast } from 'sonner'
import { modelConfigs } from '@/utils/modelConfigs'
import { aspectRatios, qualityOptions } from '@/utils/imageConfigs'

const MAX_RETRIES = 5;

const getRetryInterval = (statusCode) => {
  switch (statusCode) {
    case 503: return 120000; // 2 minutes
    case 500: return 10000;  // 10 seconds
    case 429: return 2000;   // 2 seconds
    default: return 5000;    // 5 seconds for other cases
  }
};

const makeDivisibleBy8 = (num) => Math.floor(num / 8) * 8;

const calculateDimensions = (useAspectRatio, aspectRatio, width, height, maxDimension) => {
  let finalWidth, finalHeight;

  if (useAspectRatio && aspectRatios[aspectRatio]) {
    const { width: ratioWidth, height: ratioHeight } = aspectRatios[aspectRatio];
    const aspectRatioValue = ratioWidth / ratioHeight;

    if (aspectRatioValue > 1) {
      finalWidth = maxDimension;
      finalHeight = Math.round(finalWidth / aspectRatioValue);
    } else {
      finalHeight = maxDimension;
      finalWidth = Math.round(finalHeight * aspectRatioValue);
    }
  } else {
    finalWidth = Math.min(maxDimension, width);
    finalHeight = Math.min(maxDimension, height);
  }

  return {
    width: makeDivisibleBy8(finalWidth),
    height: makeDivisibleBy8(finalHeight)
  };
};

const handleApiResponse = async (response, retryCount, generateImage) => {
  if (!response.ok) {
    const errorData = await response.json();
    console.error('API response error:', errorData);

    const retryableErrors = [500, 503, 429];
    if (retryableErrors.includes(response.status)) {
      if (retryCount < MAX_RETRIES) {
        const retryInterval = getRetryInterval(response.status);
        console.log(`Retrying image generation in ${retryInterval / 1000} seconds. Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, retryInterval));
        return generateImage(retryCount + 1);
      } else {
        throw new Error(`Max retries reached. Unable to generate image. Last error: ${errorData.error || response.statusText}`);
      }
    }

    throw new Error(`API error: ${errorData.error || response.statusText}`);
  }

  return await response.blob();
};

const styleSuffixes = {
  general: 'ultra-detailed, hyper-realistic, cinematic lighting, dynamic composition, intricate textures, volumetric lighting, soft shadows, vivid colors, highly polished, 8K resolution, photorealistic rendering, depth of field, with sharp details and perfect symmetry',
  anime: 'in a highly detailed anime art style, with vibrant colors, dynamic lighting, clean lines, expressive facial features, large eyes, and a stylized background. The characters should have smooth, cel-shaded textures and distinct, exaggerated emotions, similar to traditional Japanese animation. The atmosphere should be lively, with intricate attention to details in the scenery and character clothing.',
  threeD: 'in a photorealistic 3D rendered style, with high-quality textures, accurate lighting and shadows, and detailed surface materials. The image should have depth and dimensionality, as if created using advanced 3D modeling and rendering software.',
  realistic: 'in a hyper-realistic style, with extreme attention to detail, accurate lighting, and true-to-life textures. The image should look as close to a high-resolution photograph as possible, capturing subtle nuances and imperfections found in reality.',
  illustration: 'in a professional illustration style, with clean lines, bold colors, and a balance of detail and simplicity. The image should have a polished, commercial quality suitable for book covers, magazines, or digital media.',
  logo: 'as a minimalist, memorable logo design. The image should be simple yet distinctive, using basic shapes, clever negative space, and a limited color palette. It should be scalable and recognizable even at small sizes.',
  graphics: 'as a modern graphic design, with bold geometric shapes, vibrant colors, and a strong sense of composition. The style should be clean and contemporary, suitable for posters, album covers, or digital media.',
  watercolor: 'in a soft, ethereal watercolor style, with gentle color washes, subtle blending, and delicate details. The image should have a light, airy quality with visible brush strokes and paper texture, capturing the translucent nature of watercolor paints.',
  oilPainting: 'in the style of a classical oil painting, with rich, textured brush strokes, deep colors, and a sense of depth achieved through layering. The image should have the look of canvas texture and the characteristic glossiness of oil paints.',
  sketch: 'as a hand-drawn sketch, with loose, expressive lines and a sense of spontaneity. The image should have a raw, unfinished quality, using hatching and cross-hatching for shading, and varying line weights to create depth and focus.',
  pixelArt: 'in a retro pixel art style, with a limited color palette and visible square pixels. The image should have a nostalgic, 8-bit or 16-bit video game aesthetic, with careful attention to detail despite the low resolution.',
  lowPoly: 'in a low poly 3D style, with simplified geometric shapes and flat or gradient color fills. The image should have a modern, stylized look with visible polygonal structures, creating a balance between abstraction and recognition.',
  conceptArt: 'as a piece of concept art, with a focus on mood, atmosphere, and world-building. The image should be detailed and imaginative, suitable for visualizing environments, characters, or scenes for films, video games, or other media productions.',
}

export const useImageGeneration = ({
  session,
  prompt,
  seed,
  randomizeSeed,
  width,
  height,
  steps,
  model,
  quality,
  useAspectRatio,
  aspectRatio,
  updateCredits,
  setGeneratingImages,
  selectedStyle,
}) => {
  const uploadImageMutation = useMutation({
    mutationFn: async ({ imageBlob, metadata }) => {
      const filePath = `${session.user.id}/${Date.now()}.png`
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, imageBlob)
      if (uploadError) throw uploadError

      const { error: insertError } = await supabase
        .from('user_images')
        .insert({
          user_id: session.user.id,
          storage_path: filePath,
          ...metadata,
        })
      if (insertError) throw insertError
    },
    onSuccess: () => {
      setGeneratingImages(prev => prev.slice(1))
    },
    onError: (error) => {
      console.error('Error uploading image:', error)
      toast.error('Failed to save image. Please try again.')
      setGeneratingImages(prev => prev.slice(1))
    },
  })

  const generateImage = async (retryCount = 0) => {
    if (!session || !prompt) {
      !session && console.log('User not authenticated');
      !prompt && toast.error('Please enter a prompt');
      return;
    }

    const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
    if (session.credits < creditCost) {
      toast.error(`Insufficient credits. You need ${creditCost} credits for ${quality} quality.`);
      return;
    }

    const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed;
    const styleSuffix = styleSuffixes[selectedStyle] || '';
    const modifiedPrompt = `${prompt} ${styleSuffix}`.trim();

    const maxDimension = qualityOptions[quality];
    const { width: finalWidth, height: finalHeight } = calculateDimensions(useAspectRatio, aspectRatio, width, height, maxDimension);

    if (retryCount === 0) {
      setGeneratingImages(prev => [...prev, { width: finalWidth, height: finalHeight }]);
    }

    try {
      const { data: apiKeyData, error: apiKeyError } = await supabase.rpc('get_random_huggingface_api_key');
      if (apiKeyError) throw new Error(`Failed to get API key: ${apiKeyError.message}`);
      if (!apiKeyData) throw new Error('No active API key available');

      const response = await fetch(modelConfigs[model]?.apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKeyData}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: modifiedPrompt,
          parameters: { seed: actualSeed, width: finalWidth, height: finalHeight, num_inference_steps: steps }
        }),
      });

      const imageBlob = await handleApiResponse(response, retryCount, generateImage);
      if (!imageBlob) return; // Retry in progress

      if (!imageBlob || imageBlob.size === 0) {
        throw new Error('Generated image is empty or invalid');
      }

      await updateCredits(quality);
      await uploadImageMutation.mutateAsync({ 
        imageBlob, 
        metadata: {
          prompt: prompt, // Store the original prompt without the style suffix
          seed: actualSeed,
          width: finalWidth,
          height: finalHeight,
          steps,
          model,
          quality,
          aspect_ratio: useAspectRatio ? aspectRatio : `${finalWidth}:${finalHeight}`,
          style: selectedStyle, // Store the selected style
        }
      });

      toast.success(`Image generated successfully. ${creditCost} credits used.`);
    } catch (error) {
      console.error('Error generating image:', error);
      if (retryCount === MAX_RETRIES) {
        toast.error(`Failed to generate image after ${MAX_RETRIES} attempts: ${error.message}`);
        setGeneratingImages(prev => prev.slice(1));
      } else if (retryCount === 0) {
        toast.error(`Encountered an error. Retrying...`);
      }
    }
  };

  return { generateImage };
};
