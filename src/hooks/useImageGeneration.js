import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { qualityOptions } from '@/utils/imageConfigs';
import { calculateDimensions, getModifiedPrompt } from '@/utils/imageUtils';
import { handleApiResponse } from '@/utils/retryUtils';
import { getApiKey } from '@/utils/apiKeyUtils';

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
  imageCount = 1
}) => {
  const generateImage = async (isPrivate = false, finalPrompt = null) => {
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

    const creditCost = { "HD": 1, "HD+": 2, "4K": 3 }[quality] * imageCount;
    const totalCredits = session.credits + (session.bonusCredits || 0);
    if (totalCredits < creditCost) {
      toast.error('Insufficient credits');
      return;
    }

    const generationPromises = [];
    for (let i = 0; i < imageCount; i++) {
      const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed + i;
      const generationId = Date.now().toString() + i;

      const modifiedPrompt = await getModifiedPrompt(finalPrompt || prompt, style, model, modelConfigs);
      const maxDimension = qualityOptions[quality];
      const { width: finalWidth, height: finalHeight, aspectRatio: finalAspectRatio } = calculateDimensions(
        useAspectRatio,
        aspectRatio,
        width,
        height,
        maxDimension
      );

      const finalStyle = modelConfigs[model]?.category === "NSFW" ? 'N/A' : (style || 'N/A');

      setGeneratingImages(prev => [...prev, {
        id: generationId,
        width: finalWidth,
        height: finalHeight,
        prompt: modifiedPrompt,
        model,
        style: finalStyle,
        is_private: isPrivate
      }]);

      const makeRequest = async (retryCount = 0) => {
        try {
          const apiKey = await getApiKey();

          const parameters = {
            seed: actualSeed,
            width: finalWidth,
            height: finalHeight
          };

          const response = await fetch(modelConfig?.apiUrl, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "x-wait-for-model": "true"
            },
            method: "POST",
            body: JSON.stringify({
              inputs: modifiedPrompt,
              parameters
            }),
          });

          const imageBlob = await handleApiResponse(response, 0, () => makeRequest(response.status === 429));
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

          const timestamp = Date.now();
          const filePath = `${session.user.id}/${timestamp}.png`;

          const { error: uploadError } = await supabase.storage
            .from('user-images')
            .upload(filePath, imageBlob);

          if (uploadError) throw uploadError;

          const { data: insertData, error: insertError } = await supabase
            .from('user_images')
            .insert([{
              user_id: session.user.id,
              storage_path: filePath,
              prompt: modifiedPrompt,
              seed: actualSeed,
              width: finalWidth,
              height: finalHeight,
              model,
              quality,
              style: finalStyle,
              aspect_ratio: finalAspectRatio,
              is_private: isPrivate
            }])
            .select()
            .single();

          if (insertError) {
            console.error('Error inserting image record:', insertError);
            throw insertError;
          }

          if (!insertData || insertData.is_private !== isPrivate) {
            console.error('Privacy flag mismatch:', { expected: isPrivate, actual: insertData?.is_private });
            throw new Error('Failed to set image privacy correctly');
          }

          setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
          toast.success(`Image generated successfully! (${isPrivate ? 'Private' : 'Public'})`);

        } catch (error) {
          console.error('Error generating image:', error);
          toast.error('Failed to generate image');
          setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
        }
      };

      generationPromises.push(makeRequest());
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
