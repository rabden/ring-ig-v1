import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { generateImage } from '@/api/generate';

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
  imageCount,
  isPrivate
}) => {
  const generateImages = useCallback(async () => {
    if (!session) {
      toast.error('Please sign in to generate images');
      return;
    }

    const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality] * imageCount;
    const { data: { credit_count, bonus_credits } } = await supabase
      .from('user_credits')
      .select('credit_count, bonus_credits')
      .eq('user_id', session.user.id)
      .single();

    const totalCredits = (credit_count || 0) + (bonus_credits || 0);
    if (totalCredits < creditCost) {
      toast.error('Not enough credits');
      return;
    }

    let finalWidth = width;
    let finalHeight = height;

    if (useAspectRatio && aspectRatio) {
      const [w, h] = aspectRatio.split(':').map(Number);
      const ratio = w / h;
      
      if (ratio > 1) {
        finalHeight = Math.round(width / ratio);
      } else {
        finalWidth = Math.round(height * ratio);
      }
    }

    const modifiedPrompt = prompt.trim();
    const finalSeed = randomizeSeed ? Math.floor(Math.random() * 2147483647) : seed;

    const generationIds = [];
    for (let i = 0; i < imageCount; i++) {
      const generationId = uuidv4();
      generationIds.push(generationId);

      setGeneratingImages(prev => [...prev, {
        id: generationId,
        width: finalWidth,
        height: finalHeight,
        prompt: modifiedPrompt,
        model,
        style: modelConfigs[model]?.category === "NSFW" ? null : style,
        is_private: isPrivate
      }]);
    }

    try {
      const response = await generateImage({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          prompt: modifiedPrompt,
          seed: finalSeed,
          width: finalWidth,
          height: finalHeight,
          model,
          quality,
          style,
          steps,
          generationIds
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate image');
      }

      const { message } = await response.json();
      toast.success(message);

      await updateCredits(-creditCost);

      for (const generationId of generationIds) {
        const { error } = await supabase
          .from('user_images')
          .insert({
            user_id: session.user.id,
            prompt: modifiedPrompt,
            seed: finalSeed,
            width: finalWidth,
            height: finalHeight,
            quality,
            model,
            style: modelConfigs[model]?.category === "NSFW" ? null : (style || 'general'),
            aspect_ratio: useAspectRatio ? aspectRatio : `${finalWidth}:${finalHeight}`,
            steps,
            generationId,
            is_private: isPrivate
          });

        if (error) {
          console.error('Error inserting image metadata:', error);
          toast.error('Failed to save image metadata');
        }
      }

    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(error.message || 'Failed to generate image');
      
      setGeneratingImages(prev => prev.filter(img => !generationIds.includes(img.id)));
    }
  }, [
    session, prompt, seed, randomizeSeed, width, height,
    model, quality, useAspectRatio, aspectRatio, updateCredits,
    setGeneratingImages, style, modelConfigs, steps, imageCount,
    isPrivate
  ]);

  return { generateImage: generateImages };
};