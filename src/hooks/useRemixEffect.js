import { useEffect } from 'react';

export const useRemixEffect = ({
  remixImage,
  isRemixRoute,
  isPro,
  modelConfigs,
  setPrompt,
  setSeed,
  setRandomizeSeed,
  setWidth,
  setHeight,
  setModel,
  setQuality,
  setStyle,
  setAspectRatio,
  setUseAspectRatio,
  setSteps
}) => {
  useEffect(() => {
    if (remixImage && isRemixRoute) {
      // Set basic properties
      setPrompt(remixImage.prompt);
      setSeed(remixImage.seed);
      setRandomizeSeed(false);
      setWidth(remixImage.width);
      setHeight(remixImage.height);
      
      // Handle model selection based on pro status
      const isProModel = modelConfigs?.[remixImage.model]?.isPremium;
      if (isProModel && !isPro) {
        const defaultModel = modelConfigs?.[remixImage.model]?.category === "NSFW" ? 'nsfwMaster' : 'turbo';
        setModel(defaultModel);
        setSteps(modelConfigs?.[defaultModel]?.defaultStep || 4);
      } else {
        setModel(remixImage.model);
        setSteps(modelConfigs?.[remixImage.model]?.defaultStep || 30);
      }

      // Handle quality settings
      if (remixImage.quality === 'HD+' && !isPro) {
        setQuality('HD');
      } else {
        setQuality(remixImage.quality);
      }

      // Handle style
      if (modelConfigs?.[remixImage.model]?.category === "NSFW") {
        setStyle(null);
      } else {
        setStyle(remixImage.style);
      }

      // Handle aspect ratio
      if (remixImage.aspect_ratio) {
        setAspectRatio(remixImage.aspect_ratio);
        setUseAspectRatio(true);
      }
    }
  }, [remixImage, isRemixRoute, isPro, modelConfigs]);
};