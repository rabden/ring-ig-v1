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
  modelConfigs,
  imageCount = 1,
  addToGenerationQueue,
  currentGeneration,
  completeCurrentGeneration
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

    // Create generation entries for the queue
    const generations = [];
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

      generations.push({
        id: generationId,
        width: finalWidth,
        height: finalHeight,
        prompt: modifiedPrompt,
        model,
        seed: actualSeed,
        quality,
        is_private: isPrivate,
        aspect_ratio: finalAspectRatio
      });
    }

    // Add generations to queue
    addToGenerationQueue(generations);
  };

  const processCurrentGeneration = async () => {
    if (!currentGeneration) return;

    const makeRequest = async (needNewKey = false) => {
      try {
        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('huggingface_api_keys')
          .select('api_key')
          .eq('is_active', true)
          .order('last_used_at', { ascending: true })
          .limit(1)
          .single();
        
        if (apiKeyError || !apiKeyData) {
          completeCurrentGeneration({ ...currentGeneration, error: 'Failed to get API key' });
          toast.error('Failed to get API key');
          return;
        }

        await supabase
          .from('huggingface_api_keys')
          .update({ last_used_at: new Date().toISOString() })
          .eq('api_key', apiKeyData.api_key);

        const modelConfig = modelConfigs[currentGeneration.model];
        const parameters = {
          seed: currentGeneration.seed,
          width: currentGeneration.width,
          height: currentGeneration.height,
          num_inference_steps: modelConfig?.inferenceSteps || 30 // Use model's inference steps or default to 30
        };

        const response = await fetch(modelConfig?.apiUrl, {
          headers: {
            Authorization: `Bearer ${apiKeyData.api_key}`,
            "Content-Type": "application/json",
            "x-wait-for-model": "true"
          },
          method: "POST",
          body: JSON.stringify({
            inputs: currentGeneration.prompt,
            parameters
          }),
        });

        const imageBlob = await handleApiResponse(response, 0, () => makeRequest(response.status === 429));
        if (!imageBlob) {
          completeCurrentGeneration({ ...currentGeneration, error: 'Failed to generate image' });
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
            prompt: currentGeneration.prompt,
            seed: currentGeneration.seed,
            width: currentGeneration.width,
            height: currentGeneration.height,
            model: currentGeneration.model,
            quality: currentGeneration.quality,
            aspect_ratio: currentGeneration.aspect_ratio,
            is_private: currentGeneration.is_private
          }])
          .select()
          .single();

        if (insertError) throw insertError;

        completeCurrentGeneration({ ...currentGeneration, ...insertData });
        toast.success(`Image generated successfully! (${currentGeneration.is_private ? 'Private' : 'Public'})`);
        await updateCredits(currentGeneration.quality, 1);

      } catch (error) {
        console.error('Error generating image:', error);
        completeCurrentGeneration({ ...currentGeneration, error: error.message });
        toast.error('Failed to generate image');
      }
    };

    await makeRequest();
  };

  // Process current generation whenever it changes
  if (currentGeneration) {
    processCurrentGeneration();
  }

  return { generateImage };
};