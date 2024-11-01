import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
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
  modelConfigs
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
      setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
    },
  });

  const generateImage = async (improvedPrompt = null, retryCount = 0) => {
    if (!session || !prompt || !modelConfigs) {
      !session && console.log('User not authenticated');
      !modelConfigs && console.log('Model configs not loaded');
      return;
    }

    const modelConfig = modelConfigs[model];
    if (modelConfig?.qualityLimits && !modelConfig.qualityLimits.includes(quality)) {
      console.error(`Quality ${quality} not supported for model ${model}`);
      return;
    }

    const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
    const totalCredits = session.credits + (session.bonusCredits || 0);
    if (totalCredits < creditCost) {
      return;
    }

    const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed;
    const finalPrompt = improvedPrompt || prompt;
    const modifiedPrompt = await getModifiedPrompt(finalPrompt, style, model, modelConfigs);
    const maxDimension = qualityOptions[quality];
    const { width: finalWidth, height: finalHeight } = calculateDimensions(useAspectRatio, aspectRatio, width, height, maxDimension);

    const generationId = Date.now().toString();
    if (retryCount === 0) {
      setGeneratingImages(prev => [...prev, { 
        id: generationId, 
        width: finalWidth, 
        height: finalHeight,
        prompt: finalPrompt,
        model,
        style: modelConfigs[model]?.category === "NSFW" ? null : style
      }]);
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
        num_inference_steps: modelConfig?.defaultStep || 30,
      };

      if (!model.toLowerCase().includes('flux')) {
        parameters.negative_prompt = "ugly, disfigured, low quality, blurry, nsfw";
      }

      const response = await fetch(modelConfig?.apiUrl, {
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

      const imageBlob = await handleApiResponse(response, retryCount, () => generateImage(improvedPrompt, retryCount + 1));
      if (!imageBlob) {
        setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
        return;
      }

      await updateCredits(quality);
      await uploadImageMutation.mutateAsync({ 
        imageBlob, 
        metadata: {
          prompt: finalPrompt,
          seed: actualSeed,
          width: finalWidth,
          height: finalHeight,
          model,
          quality,
          style: modelConfigs[model]?.category === "NSFW" ? "N/A" : (style || 'general'),
          aspect_ratio: useAspectRatio ? aspectRatio : `${finalWidth}:${finalHeight}`,
          generationId
        }
      });

    } catch (error) {
      console.error('Error generating image:', error);
      setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
    }
  };

  return { generateImage };
};