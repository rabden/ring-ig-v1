import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import { toast } from 'sonner'
import { modelConfigs } from '@/utils/modelConfigs'
import { aspectRatios, qualityOptions } from '@/utils/imageConfigs'
import { styleConfigs } from '@/utils/styleConfigs'

const MAX_RETRIES = 5;

const getRetryInterval = (statusCode) => {
  switch (statusCode) {
    case 503: return 120000; // 2 minutes
    case 500: return 10000;  // 10 seconds
    case 429: return 2000;   // 2 seconds
    default: return 5000;    // 5 seconds for other cases
  }
};

// Updated to make dimensions divisible by 16
const makeDivisibleBy16 = (num) => Math.floor(num / 16) * 16;

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
    width: makeDivisibleBy16(finalWidth),
    height: makeDivisibleBy16(finalHeight)
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

export const useImageGeneration = ({
  session,
  prompt,
  seed,
  randomizeSeed,
  width,
  height,
  model,
  quality,
  useAspectRatio,
  aspectRatio,
  updateCredits,
  setGeneratingImages,
  style,
}) => {
  const uploadImageMutation = useMutation({
    mutationFn: async ({ imageBlob, metadata }) => {
      const filePath = `${session.user.id}/${Date.now()}.png`
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, imageBlob)
      if (uploadError) throw uploadError

      // Remove generationId before inserting into database
      const { generationId, ...dbMetadata } = metadata
      
      const { error: insertError } = await supabase
        .from('user_images')
        .insert({
          user_id: session.user.id,
          storage_path: filePath,
          ...dbMetadata,
          style: dbMetadata.style || 'general'
        })
      if (insertError) throw insertError
    },
    onSuccess: (_, { metadata: { generationId } }) => {
      setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
    },
    onError: (error, { metadata: { generationId } }) => {
      console.error('Error uploading image:', error);
      toast.error('Failed to save image. Please try again.');
      setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
    },
  });

  const generateImage = async (retryCount = 0) => {
    if (!session || !prompt) {
      !session && console.log('User not authenticated');
      !prompt && toast.error('Please enter a prompt');
      return;
    }

    const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
    const totalCredits = session.credits + (session.bonusCredits || 0);
    if (totalCredits < creditCost) {
      toast.error(`Insufficient credits. You need ${creditCost} credits for ${quality} quality.`);
      return;
    }

    const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed;
    const styleSuffix = styleConfigs[style]?.suffix || styleConfigs.general.suffix;
    const modifiedPrompt = `${prompt}, ${styleSuffix}${modelConfigs[model]?.promptSuffix || ''}`;

    const maxDimension = qualityOptions[quality];
    const { width: finalWidth, height: finalHeight } = calculateDimensions(useAspectRatio, aspectRatio, width, height, maxDimension);

    const generationId = Date.now().toString();
    if (retryCount === 0) {
      setGeneratingImages(prev => [...prev, { id: generationId, width: finalWidth, height: finalHeight }]);
    }

    try {
      const { data: apiKeyData, error: apiKeyError } = await supabase.rpc('get_random_huggingface_api_key');
      if (apiKeyError) {
        setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
        throw new Error(`Failed to get API key: ${apiKeyError.message}`);
      }
      if (!apiKeyData) {
        setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
        throw new Error('No active API key available');
      }

      const parameters = { 
        seed: actualSeed, 
        width: finalWidth, 
        height: finalHeight, 
        num_inference_steps: modelConfigs[model].defaultStep 
      };

      const response = await fetch(modelConfigs[model]?.apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKeyData}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true"
        },
        method: "POST",
        body: JSON.stringify({
          inputs: modifiedPrompt,
          parameters
        }),
      });

      const imageBlob = await handleApiResponse(response, retryCount, generateImage);
      if (!imageBlob) {
        setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
        return;
      }

      if (!imageBlob || imageBlob.size === 0) {
        setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
        throw new Error('Generated image is empty or invalid');
      }

      await updateCredits(quality);
      await uploadImageMutation.mutateAsync({ 
        imageBlob, 
        metadata: {
          prompt,
          seed: actualSeed,
          width: finalWidth,
          height: finalHeight,
          model,
          quality,
          style: style || 'general',
          aspect_ratio: useAspectRatio ? aspectRatio : `${finalWidth}:${finalHeight}`,
          generationId
        }
      });

      toast.success(`Image generated successfully. ${creditCost} credits used.`);
    } catch (error) {
      console.error('Error generating image:', error);
      setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
      if (retryCount === MAX_RETRIES) {
        toast.error(`Failed to generate image after ${MAX_RETRIES} attempts: ${error.message}`);
      } else if (retryCount === 0) {
        toast.error(`Encountered an error. Retrying...`);
      }
    }
  };

  return { generateImage };
};