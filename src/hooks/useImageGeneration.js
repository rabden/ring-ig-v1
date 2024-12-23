import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { qualityOptions } from '@/utils/imageConfigs';
import { calculateDimensions, getModifiedPrompt } from '@/utils/imageUtils';
import { handleApiResponse, initRetryCount, getRetryCount } from '@/utils/retryUtils';
import { useState, useRef, useCallback, useEffect } from 'react';

const MAX_RETRIES = 5;
const STORAGE_KEY = 'imageGeneratorState';

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
  const processingTimeoutRef = useRef(null);

  // Handle cancellation of a generation
  const handleCancel = useCallback(async (generationId) => {
    // Find the generation in the queue
    const queueIndex = generationQueue.current.findIndex(gen => gen.generationId === generationId);
    const generation = queueIndex !== -1 ? generationQueue.current[queueIndex] : null;

    // Remove from queue if found
    if (queueIndex !== -1) {
      generationQueue.current.splice(queueIndex, 1);
    }

    // Update UI state and localStorage
    setGeneratingImages(prev => {
      const newState = prev.filter(img => img.id !== generationId);
      return newState;
    });

    // Refund credits if necessary
    if (generation?.shouldRefundCredits) {
      try {
        await updateCredits({ quality, imageCount: 1, isRefund: true });
        toast.success('Credits refunded');
      } catch (error) {
        console.error('Error refunding credits:', error);
        toast.error('Failed to refund credits');
      }
    }

    // If this was the processing generation, start processing the next one
    if (queueIndex === 0) {
      setIsProcessing(false);
      if (generationQueue.current.length > 0) {
        processQueue();
      }
    }
  }, [quality, updateCredits, setGeneratingImages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      // Refund credits for any pending generations
      if (generationQueue.current.length > 0) {
        generationQueue.current.forEach(async (generation) => {
          if (generation.shouldRefundCredits) {
            await updateCredits({ quality, imageCount: 1, isRefund: true });
          }
        });
      }
    };
  }, [quality, updateCredits]);

  // Check for existing processing images on mount and when generatingImages changes
  useEffect(() => {
    // Restore queue state from UI state
    setGeneratingImages(prev => {
      const activeImages = prev.filter(img => img.status === 'pending' || img.status === 'processing');
      
      // Rebuild queue from active images
      generationQueue.current = activeImages.map(img => ({
        generationId: img.id,
        finalWidth: img.width,
        finalHeight: img.height,
        modifiedPrompt: img.prompt,
        actualSeed: img.seed || Math.floor(Math.random() * 1000000),
        isPrivate: img.is_private,
        modelConfig: modelConfigs?.[img.model],
        finalAspectRatio: img.aspect_ratio,
        shouldRefundCredits: true
      }));

      return activeImages;
    });

    // Start processing if there are items in queue
    if (!isProcessing && generationQueue.current.length > 0) {
      processQueue();
    }
  }, [modelConfigs]);

  // Process the queue one item at a time
  const processQueue = useCallback(async () => {
    if (isProcessing || generationQueue.current.length === 0) return;

    setIsProcessing(true);
    const currentGeneration = generationQueue.current[0];

    // Set a timeout to prevent stuck processing state
    processingTimeoutRef.current = setTimeout(() => {
      if (isProcessing) {
        setIsProcessing(false);
        setGeneratingImages(prev => prev.map(img => 
          img.id === currentGeneration.generationId 
            ? { ...img, status: 'failed', error: 'Generation timed out' } 
            : img
        ));
        if (currentGeneration.shouldRefundCredits) {
          updateCredits({ quality, imageCount: 1, isRefund: true });
        }
        toast.error('Generation timed out');
      }
    }, 300000); // 5 minutes timeout

    try {
      const {
        generationId,
        finalWidth,
        finalHeight,
        modifiedPrompt,
        actualSeed,
        isPrivate,
        modelConfig,
        finalAspectRatio,
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
            setGeneratingImages(prev => prev.map(img => 
              img.id === generationId 
                ? { ...img, status: 'failed', error: `Failed to get API key: ${apiKeyError.message}` } 
                : img
            ));
            toast.error('Failed to get API key');
            if (shouldRefundCredits) {
              await updateCredits({ quality, imageCount: 1, isRefund: true });
            }
            throw new Error(`Failed to get API key: ${apiKeyError.message}`);
          }
          if (!apiKeyData) {
            setGeneratingImages(prev => prev.map(img => 
              img.id === generationId 
                ? { ...img, status: 'failed', error: 'No active API key available' } 
                : img
            ));
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

          const imageBlob = await handleApiResponse(response, generationId, async () => {
            // Update status to show we're retrying
            setGeneratingImages(prev => prev.map(img => 
              img.id === generationId 
                ? { 
                    ...img, 
                    status: 'processing',
                    retryCount: getRetryCount(generationId),
                    retryReason: response.status === 429 ? 'Rate limit reached' : 'Server error'
                  } 
                : img
            ));
            
            // Add a small delay to show the retry status
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return makeRequest(response.status === 429);
          });
          
          if (!imageBlob) {
            return;
          }

          if (!imageBlob || imageBlob.size === 0) {
            setGeneratingImages(prev => prev.map(img => 
              img.id === generationId 
                ? { 
                    ...img, 
                    status: 'failed', 
                    error: 'Generated image is invalid',
                    retryCount: getRetryCount(generationId)
                  } 
                : img
            ));
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
            setGeneratingImages(prev => prev.map(img => 
              img.id === generationId 
                ? { ...img, status: 'failed', error: `Failed to upload image: ${uploadError.message}` } 
                : img
            ));
            toast.error('Failed to upload image');
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
              aspect_ratio: finalAspectRatio || '1:1',
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

          // Update UI to show completion with image data
          setGeneratingImages(prev => prev.map(img => 
            img.id === generationId ? { 
              ...img, 
              status: 'completed',
              storage_path: filePath,
              seed: actualSeed,
              width: finalWidth,
              height: finalHeight,
              model,
              quality,
              aspect_ratio: finalAspectRatio || '1:1',
              is_private: isPrivate
            } : img
          ));

          toast.success(`Image generated successfully! (${isPrivate ? 'Private' : 'Public'})`);

        } catch (error) {
          console.error('Error generating image:', error);
          const retryableStatuses = [500, 503, 504, 429];
          const isRetryableError = error.status && retryableStatuses.includes(error.status) && getRetryCount(generationId) < MAX_RETRIES;
          
          if (!isRetryableError) {
            setGeneratingImages(prev => prev.map(img => 
              img.id === generationId 
                ? { 
                    ...img, 
                    status: 'failed', 
                    error: error.message,
                    retryCount: getRetryCount(generationId),
                    retryReason: error.status === 429 ? 'Rate limit reached' : 'Server error'
                  } 
                : img
            ));
            toast.error('Failed to generate image');
            if (shouldRefundCredits) {
              await updateCredits({ quality, imageCount: 1, isRefund: true });
            }
          }
        }
      };

      await makeRequest();

    } catch (error) {
      console.error('Error in generation:', error);
      setGeneratingImages(prev => prev.map(img => 
        img.id === currentGeneration.generationId 
          ? { ...img, status: 'failed', error: error.message } 
          : img
      ));
      if (currentGeneration.shouldRefundCredits) {
        await updateCredits({ quality, imageCount: 1, isRefund: true });
      }
    } finally {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
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

    // Validate model exists
    const modelConfig = modelConfigs[model];
    if (!modelConfig) {
      toast.error('Invalid model selected');
      return;
    }

    // Check for existing generations
    const hasActiveGenerations = generationQueue.current.length > 0;
    if (hasActiveGenerations) {
      toast.error('Please wait for current generations to complete or cancel them');
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
        aspectRatio || '1:1',
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
        status: 'pending',
        aspect_ratio: finalAspectRatio || '1:1',
        created_at: new Date().toISOString()
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
        finalAspectRatio: finalAspectRatio || '1:1',
        shouldRefundCredits: true
      });
    }

    // Start processing if not already processing
    if (!isProcessing) {
      processQueue();
    }
  };

  return {
    generateImage,
    handleCancel
  };
};