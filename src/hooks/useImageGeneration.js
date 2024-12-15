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
      
      const modifiedPrompt = await getModifiedPrompt(finalPrompt || prompt, model, modelConfigs);
      const maxDimension = qualityOptions[quality];
      const { width: finalWidth, height: finalHeight, aspectRatio: finalAspectRatio } = calculateDimensions(
        useAspectRatio, 
        aspectRatio, 
        width, 
        height, 
        maxDimension
      );

      // Start tracking the generation in Supabase
      const generation = await startGeneration({
        prompt: modifiedPrompt,
        model,
        seed: actualSeed,
        width: finalWidth,
        height: finalHeight,
        quality,
        aspect_ratio: finalAspectRatio,
        is_private: isPrivate
      });

      if (!generation) continue;

      setGeneratingImages(prev => [...prev, { 
        id: generation.id,
        width: finalWidth, 
        height: finalHeight,
        prompt: modifiedPrompt,
        model,
        is_private: isPrivate
      }]);

      const makeRequest = async (needNewKey = false) => {
        try {
          const { data: apiKeyData, error: apiKeyError } = await supabase
            .from('huggingface_api_keys')
            .select('api_key')
            .eq('is_active', true)
            .order('last_used_at', { ascending: true })
            .limit(1)
            .single();
          
          if (apiKeyError) {
            await failGeneration(generation.id, 'Failed to get API key');
            setGeneratingImages(prev => prev.filter(img => img.id !== generation.id));
            toast.error('Failed to get API key');
            throw new Error(`Failed to get API key: ${apiKeyError.message}`);
          }
          if (!apiKeyData) {
            await failGeneration(generation.id, 'No active API key available');
            setGeneratingImages(prev => prev.filter(img => img.id !== generation.id));
            toast.error('No active API key available');
            throw new Error('No active API key available');
          }

          await supabase
            .from('huggingface_api_keys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('api_key', apiKeyData.api_key);

          const parameters = {
            seed: actualSeed,
            width: finalWidth,
            height: finalHeight
          };

          const response = await fetch(modelConfig?.apiUrl, {
            headers: {
              Authorization: `Bearer ${apiKeyData.api_key}`,
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
            await failGeneration(generation.id, 'Failed to generate image');
            setGeneratingImages(prev => prev.filter(img => img.id !== generation.id));
            toast.error('Failed to generate image');
            return;
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
              aspect_ratio: finalAspectRatio,
              is_private: isPrivate
            }])
            .select()
            .single();

          if (insertError) throw insertError;

          await completeGeneration(generation.id, filePath);
          setGeneratingImages(prev => prev.filter(img => img.id !== generation.id));
          toast.success(`Image generated successfully! (${isPrivate ? 'Private' : 'Public'})`);

        } catch (error) {
          console.error('Error generating image:', error);
          await failGeneration(generation.id, error.message);
          toast.error('Failed to generate image');
          setGeneratingImages(prev => prev.filter(img => img.id !== generation.id));
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
