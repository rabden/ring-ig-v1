import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { qualityOptions } from '@/utils/imageConfigs';
import { calculateDimensions, getModifiedPrompt } from '@/utils/imageUtils';
import { handleApiResponse, initRetryCount } from '@/utils/retryUtils';
import { useState, useRef, useCallback } from 'react';

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
  imageCount = 1,
  negativePrompt
}) => {
  // Queue to store pending generations
  const generationQueue = useRef([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Process the queue one item at a time
  const processQueue = useCallback(async () => {
    if (isProcessing || generationQueue.current.length === 0) return;

    setIsProcessing(true);
    const currentGeneration = generationQueue.current[0];

    try {
      const {
        generationId,
        finalWidth,
        finalHeight,
        modifiedPrompt,
        actualSeed,
        isPrivate,
        modelConfig,
        shouldRefundCredits
      } = currentGeneration;

      // Update UI to show processing status
      setGeneratingImages(prev => prev.map(img => 
        img.id === generationId ? { ...img, status: 'processing' } : img
      ));

      const makeRequest = async (needNewKey = false) => {
        try {
          initRetryCount(generationId);

          const { data: apiKeyData, error: apiKeyError } = await supabase
            .from('huggingface_api_keys')
            .select('api_key')
            .eq('is_active', true)
            .order('last_used_at', { ascending: true })
            .limit(1)
            .single();
          
          if (apiKeyError) {
            setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
            toast.error('Failed to get API key');
            if (shouldRefundCredits) {
              await updateCredits({ quality, imageCount: 1, isRefund: true });
            }
            throw new Error(`Failed to get API key: ${apiKeyError.message}`);
          }
          if (!apiKeyData) {
            setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
            toast.error('No active API key available');
            if (shouldRefundCredits) {
              await updateCredits({ quality, imageCount: 1, isRefund: true });
            }
            throw new Error('No active API key available');
          }

          await supabase
            .from('huggingface_api_keys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('api_key', apiKeyData.api_key);

          const parameters = {
            seed: actualSeed,
            width: finalWidth,
            height: finalHeight,
            ...(modelConfig.steps && { num_inference_steps: parseInt(modelConfig.steps) }),
            ...(modelConfig.use_guidance && { guidance_scale: modelConfig.defaultguidance }),
            ...(modelConfig.use_negative_prompt && modelConfig.default_negative_prompt && { 
              negative_prompt: negativePrompt || modelConfig.default_negative_prompt 
            })
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

          const imageBlob = await handleApiResponse(response, generationId, () => makeRequest(response.status === 429));
          if (!imageBlob) {
            setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
            toast.error('Failed to generate image');
            if (shouldRefundCredits) {
              await updateCredits({ quality, imageCount: 1, isRefund: true });
            }
            return;
          }

          if (!imageBlob || imageBlob.size === 0) {
            setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
            toast.error('Generated image is invalid');
            if (shouldRefundCredits) {
              await updateCredits({ quality, imageCount: 1, isRefund: true });
            }
            throw new Error('Generated image is empty or invalid');
          }

          const timestamp = Date.now();
          const filePath = `${session.user.id}/${timestamp}.png`;
          
          const { error: uploadError } = await supabase.storage
            .from('user-images')
            .upload(filePath, imageBlob);
            
          if (uploadError) {
            if (shouldRefundCredits) {
              await updateCredits({ quality, imageCount: 1, isRefund: true });
            }
            throw uploadError;
          }

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
              aspect_ratio: currentGeneration.finalAspectRatio,
              is_private: isPrivate
            }])
            .select()
            .single();

          if (insertError) {
            console.error('Error inserting image record:', insertError);
            if (shouldRefundCredits) {
              await updateCredits({ quality, imageCount: 1, isRefund: true });
            }
            throw insertError;
          }

          // Update UI to show completion
          setGeneratingImages(prev => prev.map(img => 
            img.id === generationId ? { ...img, status: 'completed' } : img
          ));

          toast.success(`Image generated successfully! (${isPrivate ? 'Private' : 'Public'})`);

        } catch (error) {
          console.error('Error generating image:', error);
          toast.error('Failed to generate image');
          setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
          if (shouldRefundCredits) {
            await updateCredits({ quality, imageCount: 1, isRefund: true });
          }
        }
      };

      await makeRequest();

    } catch (error) {
      console.error('Error in generation:', error);
      if (currentGeneration.shouldRefundCredits) {
        await updateCredits({ quality, imageCount: 1, isRefund: true });
      }
    } finally {
      // Remove the processed item from queue
      generationQueue.current.shift();
      setIsProcessing(false);
      
      // Process next item if any
      if (generationQueue.current.length > 0) {
        processQueue();
      }
    }
  }, [isProcessing, session, model, quality, setGeneratingImages, negativePrompt, updateCredits]);

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

    // Deduct credits upfront for all images
    try {
      const result = await updateCredits({ quality, imageCount });
      if (result === -1) {
        toast.error('Insufficient credits');
        return;
      }
    } catch (error) {
      console.error('Error updating credits:', error);
      toast.error('Failed to process credits');
      return;
    }

    // Add all requested images to the queue
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

      // Add to UI with pending status
      setGeneratingImages(prev => [...prev, { 
        id: generationId, 
        width: finalWidth, 
        height: finalHeight,
        prompt: modifiedPrompt,
        model,
        is_private: isPrivate,
        status: 'pending'
      }]);

      // Add to queue with refund flag
      generationQueue.current.push({
        generationId,
        finalWidth,
        finalHeight,
        modifiedPrompt,
        actualSeed,
        isPrivate,
        modelConfig,
        finalAspectRatio,
        shouldRefundCredits: true // Flag to indicate this generation should refund credits on failure
      });
    }

    // Start processing if not already processing
    if (!isProcessing) {
      processQueue();
    }
  };

  return { generateImage };
};