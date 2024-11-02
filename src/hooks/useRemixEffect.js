import { useEffect } from 'react';

export const useRemixEffect = ({
  remixImage,
  isRemixRoute,
  isPro,
  modelConfigs,
  styleConfigs,
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
        const styleExists = remixImage.style && styleConfigs?.[remixImage.style];
        const isPremiumStyle = styleExists && styleConfigs?.[remixImage.style]?.isPremium;
        
        if (styleExists) {
          if (isPremiumStyle && !isPro) {
            setStyle(null);
          } else {
            setStyle(remixImage.style);
          }
        } else {
          setStyle(null);
        }
      }

      // Handle aspect ratio
      if (remixImage.aspect_ratio) {
        const premiumRatios = ['9:21', '21:9', '3:2', '2:3', '4:5', '5:4', '10:16', '16:10'];
        const isPremiumRatio = premiumRatios.includes(remixImage.aspect_ratio);

        if (isPremiumRatio && !isPro) {
          setAspectRatio('1:1');
          setUseAspectRatio(true);
        } else {
          setAspectRatio(remixImage.aspect_ratio);
          setUseAspectRatio(true);
        }
      }
    }
  }, [remixImage, isRemixRoute, isPro, modelConfigs, styleConfigs]);
};