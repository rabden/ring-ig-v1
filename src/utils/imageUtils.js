import { qualityOptions, aspectRatios } from '@/utils/imageConfigs';
import { styleConfig } from '@/config/styleConfig';

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

export const getModifiedPrompt = async (prompt, style, model, modelConfigs) => {
  if (!modelConfigs) return prompt;
  
  const modelConfig = modelConfigs[model];
  if (modelConfig?.noStyleSuffix || modelConfig?.category === "NSFW") {
    return prompt;
  }
  
  // Get style suffix from styleConfig, defaulting to general style if none selected
  const selectedStyle = style && styleConfig[style] ? styleConfig[style] : styleConfig.general;
  const styleSuffix = selectedStyle?.suffix || '';
  
  // Combine prompt with style suffix and model-specific suffix
  const modifiedPrompt = `${prompt}, ${styleSuffix}${modelConfig?.promptSuffix || ''}`;
  
  return modifiedPrompt;
};