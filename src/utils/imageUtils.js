import { qualityOptions, aspectRatios, findClosestAspectRatio } from '@/utils/imageConfigs';
import { supabase } from '@/integrations/supabase/supabase';

export const makeDivisibleBy16 = (num) => Math.floor(num / 16) * 16;

export const calculateDimensions = (useAspectRatio, aspectRatio, width, height, maxDimension) => {
  let finalWidth, finalHeight;

  if (useAspectRatio && aspectRatios[aspectRatio]) {
    const { width: ratioWidth, height: ratioHeight } = aspectRatios[aspectRatio];
    const aspectRatioValue = ratioWidth / ratioHeight;

    if (aspectRatioValue > 1) {
      finalWidth = maxDimension;
      finalHeight = Math.round(finalWidth / aspectRatioValue);
    } else {
      finalHeight = maxDimension;
      finalWidth = Math.round(finalHeight * aspectRatioValue);
    }
  } else {
    finalWidth = Math.min(maxDimension, width);
    finalHeight = Math.min(maxDimension, height);
  }

  finalWidth = makeDivisibleBy16(finalWidth);
  finalHeight = makeDivisibleBy16(finalHeight);

  return {
    width: finalWidth,
    height: finalHeight,
    aspectRatio: useAspectRatio ? aspectRatio : findClosestAspectRatio(finalWidth, finalHeight)
  };
};

export const getModifiedPrompt = async (prompt, model, modelConfigs) => {
  if (!modelConfigs) return prompt;
  
  const modelConfig = modelConfigs[model];
  if (modelConfig?.noStyleSuffix || modelConfig?.category === "NSFW") {
    return prompt;
  }
  
  return prompt + (modelConfig?.promptSuffix || '');
};

export const getOptimizedImageUrl = (storagePath, options = {}) => {
  const { width = 512, quality = 60 } = options;
  const publicUrl = supabase.storage.from('user-images').getPublicUrl(storagePath).data.publicUrl;
  return `${publicUrl}?width=${width}&quality=${quality}`;
};