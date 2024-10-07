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
    const modifiedPrompt = prompt + (modelConfigs[model]?.promptSuffix || '');

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
          prompt: modifiedPrompt,
          seed: actualSeed,
          width: finalWidth,
          height: finalHeight,
          steps,
          model,
          quality,
          aspect_ratio: useAspectRatio ? aspectRatio : `${finalWidth}:${finalHeight}`,
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