import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { modelConfigs } from '@/utils/modelConfigs';
import { qualityOptions } from '@/utils/imageConfigs';
import { calculateDimensions, getModifiedPrompt } from '@/utils/imageUtils';
import { handleApiResponse } from '@/utils/retryUtils';

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
      const filePath = `${session.user.id}/${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, imageBlob);
      if (uploadError) throw uploadError;

      const { generationId, ...dbMetadata } = metadata;
      
      const { error: insertError } = await supabase
        .from('user_images')
        .insert({
          user_id: session.user.id,
          storage_path: filePath,
          ...dbMetadata,
          style: dbMetadata.style || 'general'
        });
      if (insertError) throw insertError;
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
    const modifiedPrompt = getModifiedPrompt(prompt, style, model);
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

      const imageBlob = await handleApiResponse(response, retryCount, () => generateImage(retryCount + 1));
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