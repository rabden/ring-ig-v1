import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { qualityOptions } from '@/utils/imageConfigs';
import { calculateDimensions, getModifiedPrompt } from '@/utils/imageUtils';
import { handleApiResponse } from '@/utils/retryUtils';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';

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
  const supabase = useSupabaseClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Create queue items for each image
      const queueItems = [];
      for (let i = 0; i < imageCount; i++) {
        const { data: queueItem, error: queueError } = await supabase
          .from('generation_queue')
          .insert({
            user_id: session.user.id,
            prompt,
            model: modelConfigs[model]?.apiUrl,
            width,
            height,
            parameters: {
              num_inference_steps: modelConfigs[model]?.inferenceSteps || 30,
              seed: randomizeSeed ? Math.floor(Math.random() * 1000000) : seed
            },
            quality,
            aspect_ratio: useAspectRatio ? aspectRatio : null,
            is_public: true
          })
          .select()
          .single();

        if (queueError) throw queueError;
        queueItems.push(queueItem);

        // Trigger edge function for the first item
        if (i === 0) {
          const { error: triggerError } = await supabase
            .functions.invoke('trigger-generation', {
              body: { id: queueItem.id }
            });

          if (triggerError) throw triggerError;
        }
      }

      return queueItems;
    } catch (error) {
      console.error('Error starting generation:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateImage,
    isGenerating,
    error
  };
};