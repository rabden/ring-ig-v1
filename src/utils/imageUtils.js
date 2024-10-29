import { qualityOptions } from '@/utils/imageConfigs';
import { styleConfigs } from '@/utils/styleConfigs';
import { modelConfigs } from '@/utils/modelConfigs';

// Makes dimensions divisible by 16 for API compatibility
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

  return {
    width: makeDivisibleBy16(finalWidth),
    height: makeDivisibleBy16(finalHeight)
  };
};

export const getModifiedPrompt = (prompt, style, model) => {
  const isNsfwModel = modelConfigs[model]?.category === "NSFW";
  const styleSuffix = !isNsfwModel ? (styleConfigs[style]?.suffix || styleConfigs.general.suffix) : '';
  return isNsfwModel ? prompt : `${prompt}, ${styleSuffix}${modelConfigs[model]?.promptSuffix || ''}`;
};