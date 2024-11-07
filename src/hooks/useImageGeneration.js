import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
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
  modelConfigs,
  steps,
  imageCount = 1
}) => {
  const generateImage = async (isPrivate = false) => {
    if (!session || !prompt || !modelConfigs) {
      !session && toast.error('Please sign in to generate images');
      !prompt && toast.error('Please enter a prompt');
      !modelConfigs && console.error('Model configs not loaded');
      return;
    }

    const modelConfig = modelConfigs[model];
    if (!modelConfig) {
      toast.error('Invalid model selected');
      return;
    }

    if (modelConfig?.qualityLimits && !modelConfig.qualityLimits.includes(quality)) {
      toast.error(`Quality ${quality} not supported for model ${model}`);
      return;
    }

    const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality] * imageCount;
    const totalCredits = session.credits + (session.bonusCredits || 0);
    if (totalCredits < creditCost) {
      toast.error('Insufficient credits');
      return;
    }

    const generationPromises = [];
    for (let i = 0; i < imageCount; i++) {
      const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed + i;
      const generationId = Date.now().toString() + i;
      
      const modifiedPrompt = await getModifiedPrompt(prompt, style, model, modelConfigs);
      const maxDimension = qualityOptions[quality];
      const { width: finalWidth, height: finalHeight } = calculateDimensions(useAspectRatio, aspectRatio, width, height, maxDimension);

      setGeneratingImages(prev => [...prev, { 
        id: generationId, 
        width: finalWidth, 
        height: finalHeight,
        prompt: modifiedPrompt,
        model,
        style: modelConfigs[model]?.category === "NSFW" ? null : style,
        is_private: isPrivate
      }]);

      const promise = (async () => {
        try {
          const { data: apiKeyData, error: apiKeyError } = await supabase.rpc('get_random_huggingface_api_key');
          if (apiKeyError) {
            setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
            toast.error('Failed to get API key');
            throw new Error(`Failed to get API key: ${apiKeyError.message}`);
          }
          if (!apiKeyData) {
            setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
            toast.error('No active API key available');
            throw new Error('No active API key available');
          }

          const parameters = {
            seed: actualSeed,
            width: finalWidth,
            height: finalHeight,
            num_inference_steps: steps || modelConfig?.defaultStep || 30,
          };

          if (!model.toLowerCase().includes('flux')) {
            parameters.negative_prompt = modelConfig?.negativePrompt || "ugly, disfigured, low quality, blurry, nsfw";
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

          const imageBlob = await handleApiResponse(response);
          if (!imageBlob) {
            setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
            toast.error('Failed to generate image');
            return;
          }

          if (!imageBlob || imageBlob.size === 0) {
            setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
            toast.error('Generated image is invalid');
            throw new Error('Generated image is empty or invalid');
          }

          const filePath = `${session.user.id}/${Date.now()}.png`;
          const { error: uploadError } = await supabase.storage
            .from('user-images')
            .upload(filePath, imageBlob);
          if (uploadError) throw uploadError;

          const { error: insertError } = await supabase
            .from('user_images')
            .insert({
              user_id: session.user.id,
              storage_path: filePath,
              prompt: modifiedPrompt,
              seed: actualSeed,
              width: finalWidth,
              height: finalHeight,
              model,
              quality,
              style: modelConfigs[model]?.category === "NSFW" ? null : (style || 'general'),
              aspect_ratio: useAspectRatio ? aspectRatio : `${finalWidth}:${finalHeight}`,
              is_private: isPrivate
            });
          if (insertError) throw insertError;

          setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
          toast.success('Image generated successfully!');

        } catch (error) {
          console.error('Error generating image:', error);
          toast.error('Failed to generate image');
          setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
        }
      })();

      generationPromises.push(promise);
    }

    try {
      await Promise.all(generationPromises);
      await updateCredits(quality, imageCount);
    } catch (error) {
      console.error('Error in batch generation:', error);
    }
  };

  return { generateImage };
};