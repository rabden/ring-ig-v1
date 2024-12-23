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
  const [isProcessing, setIsProcessing] = useState(false);
  const processingTimeoutRef = useRef(null);
  const generationQueue = useRef([]);

  // Simplified cancel handler
  const handleCancel = useCallback((generationId) => {
    setGeneratingImages(prev => prev.filter(img => img.id !== generationId));
    generationQueue.current = generationQueue.current.filter(gen => gen.generationId !== generationId);
    
    if (isProcessing) {
      setIsProcessing(false);
      processQueue();
    }
  }, [isProcessing]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  // Restore state on mount
  useEffect(() => {
    if (!modelConfigs) return;

    setGeneratingImages(prev => {
      const pendingImages = prev.filter(img => 
        img.status === 'pending' || img.status === 'processing'
      );

      generationQueue.current = pendingImages.map(img => ({
        generationId: img.id,
        finalWidth: img.width,
        finalHeight: img.height,
        modifiedPrompt: img.prompt,
        actualSeed: img.seed || Math.floor(Math.random() * 1000000),
        isPrivate: img.is_private,
        modelConfig: modelConfigs[img.model],
        finalAspectRatio: img.aspect_ratio
      }));

      return pendingImages;
    });

    if (!isProcessing && generationQueue.current.length > 0) {
      processQueue();
    }
  }, [modelConfigs]);

  // Simplified queue processing
  const processQueue = useCallback(async () => {
    if (isProcessing || generationQueue.current.length === 0) return;

    const currentGeneration = generationQueue.current[0];
    if (!currentGeneration) return;

    setIsProcessing(true);

    // Set timeout
    processingTimeoutRef.current = setTimeout(() => {
      if (isProcessing) {
        handleCancel(currentGeneration.generationId);
        toast.error('Generation timed out');
      }
    }, 300000);

    try {
      const {
        generationId,
        finalWidth,
        finalHeight,
        modifiedPrompt,
        actualSeed,
        isPrivate,
        modelConfig,
        finalAspectRatio
      } = currentGeneration;

      // Update status to processing
      setGeneratingImages(prev => prev.map(img => 
        img.id === generationId ? { ...img, status: 'processing' } : img
      ));

      // Make the API request
      const makeRequest = async () => {
        try {
          initRetryCount(generationId);

          // Get API key
          const { data: apiKeyData, error: apiKeyError } = await supabase
            .from('huggingface_api_keys')
            .select('api_key')
            .eq('is_active', true)
            .order('last_used_at', { ascending: true })
            .limit(1)
            .single();

          if (apiKeyError || !apiKeyData) {
            throw new Error(apiKeyError?.message || 'No active API key available');
          }

          // Update key usage timestamp
          await supabase
            .from('huggingface_api_keys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('api_key', apiKeyData.api_key);

          // Make the generation request
          const response = await fetch(modelConfig?.apiUrl, {
            headers: {
              Authorization: `Bearer ${apiKeyData.api_key}`,
              "Content-Type": "application/json",
              "x-wait-for-model": "true"
            },
            method: "POST",
            body: JSON.stringify({
              inputs: modifiedPrompt,
              parameters: {
                seed: actualSeed,
                width: finalWidth,
                height: finalHeight,
                ...(modelConfig.steps && { num_inference_steps: parseInt(modelConfig.steps) }),
                ...(modelConfig.use_guidance && { guidance_scale: modelConfig.defaultguidance }),
                ...(modelConfig.use_negative_prompt && modelConfig.default_negative_prompt && { 
                  negative_prompt: negativePrompt || modelConfig.default_negative_prompt 
                })
              }
            }),
          });

          // Handle response with retries
          const imageBlob = await handleApiResponse(response, generationId, async () => {
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
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            return makeRequest();
          });

          if (!imageBlob || imageBlob.size === 0) {
            throw new Error('Generated image is invalid');
          }

          // Upload the image
          const timestamp = Date.now();
          const filePath = `${session.user.id}/${timestamp}.png`;
          
          const { error: uploadError } = await supabase.storage
            .from('user-images')
            .upload(filePath, imageBlob);
            
          if (uploadError) throw uploadError;

          // Save to database
          const { error: insertError } = await supabase
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

          if (insertError) throw insertError;

          // Update UI state
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
          const retryableStatuses = [500, 503, 504, 429];
          const isRetryableError = error.status && retryableStatuses.includes(error.status) && getRetryCount(generationId) < MAX_RETRIES;
          
          if (!isRetryableError) {
            setGeneratingImages(prev => prev.map(img => 
              img.id === generationId 
                ? { 
                    ...img, 
                    status: 'failed', 
                    error: error.message,
                    retryCount: getRetryCount(generationId)
                  } 
                : img
            ));
            // Only refund for non-retryable errors
            await updateCredits({ quality, imageCount: 1, isRefund: true });
            throw error;
          }
          return makeRequest();
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
    } finally {
      clearTimeout(processingTimeoutRef.current);
      generationQueue.current.shift();
      setIsProcessing(false);
      
      if (generationQueue.current.length > 0) {
        processQueue();
      }
    }
  }, [isProcessing, session, model, quality, setGeneratingImages, negativePrompt, updateCredits, handleCancel]);

  // Add new generations to queue
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

    try {
      const result = await updateCredits({ quality, imageCount });
      if (result === -1) {
        toast.error('Insufficient credits');
        return;
      }

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

        // Add to UI state
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

        // Add to queue
        generationQueue.current.push({
          generationId,
          finalWidth,
          finalHeight,
          modifiedPrompt,
          actualSeed,
          isPrivate,
          modelConfig,
          finalAspectRatio: finalAspectRatio || '1:1'
        });
      }

      if (!isProcessing) {
        processQueue();
      }
    } catch (error) {
      console.error('Error starting generation:', error);
      toast.error('Failed to start generation');
    }
  };

  return { generateImage, handleCancel };
};