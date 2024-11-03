import { useProUser } from '@/hooks/useProUser';
import { useModelConfigs } from '@/hooks/useModelConfigs';

export const useRemixImage = ({
  setPrompt,
  setSeed,
  setRandomizeSeed,
  setWidth,
  setHeight,
  setModel,
  setSteps,
  setQuality,
  setStyle,
  setAspectRatio,
  setUseAspectRatio,
  session,
  aspectRatios
}) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: isPro } = useProUser(session?.user?.id);

  const handleRemix = (image) => {
    if (!session) {
      return;
    }

    setPrompt(image.prompt);
    setSeed(image.seed);
    setRandomizeSeed(false);
    setWidth(image.width);
    setHeight(image.height);

    // Handle model selection based on user's pro status
    const isProModel = modelConfigs?.[image.model]?.isPremium;
    if (isProModel && !isPro) {
      setModel('turbo');
      setSteps(modelConfigs['turbo']?.defaultStep || 4);
    } else {
      setModel(image.model);
      setSteps(image.steps);
    }

    // Handle quality settings
    if (image.quality === 'HD+' && !isPro) {
      setQuality('HD');
    } else {
      setQuality(image.quality);
    }

    // Handle style
    const styleConfig = modelConfigs?.[image.model];
    if (styleConfig?.noStyleSuffix) {
      setStyle?.(null);
    } else if (image.style) {
      setStyle?.(isPro ? image.style : null);
    } else {
      setStyle?.(null);
    }

    // Handle aspect ratio
    const isPremiumRatio = ['9:21', '21:9', '3:2', '2:3', '4:5', '5:4', '10:16', '16:10'].includes(image.aspect_ratio);
    if (isPremiumRatio && !isPro) {
      setAspectRatio('1:1');
      setUseAspectRatio(true);
    } else {
      setAspectRatio(image.aspect_ratio);
      setUseAspectRatio(image.aspect_ratio in aspectRatios);
    }
  };

  return handleRemix;
};