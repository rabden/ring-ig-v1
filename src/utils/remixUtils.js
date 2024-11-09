import { toast } from 'sonner';

export const handleImageRemix = (image, {
  setPrompt,
  setSeed,
  setRandomizeSeed,
  setWidth,
  setHeight,
  setModel,
  setSteps,
  setStyle,
  setQuality,
  setAspectRatio,
  setUseAspectRatio,
  setActiveTab,
  onClose,
  modelConfigs,
  isPro
}) => {
  if (!image) {
    toast.error('Invalid image data');
    return;
  }

  // Clean the prompt by removing any style suffix
  setPrompt(image.user_prompt || image.prompt);
  setSeed(image.seed);
  setRandomizeSeed(false);
  setWidth(image.width);
  setHeight(image.height);

  // Check if the original image was made with a pro model
  const isProModel = modelConfigs?.[image.model]?.isPremium;
  const isNsfwModel = modelConfigs?.[image.model]?.category === "NSFW";

  // Set model based on NSFW status and pro status
  if (isNsfwModel) {
    setModel('nsfwMaster');
    setSteps(modelConfigs['nsfwMaster']?.defaultStep || 30);
    setStyle(null);
  } else if (isProModel && !isPro) {
    setModel('turbo');
    setSteps(modelConfigs['turbo']?.defaultStep || 4);
    setStyle(null);
  } else {
    setModel(image.model);
    setSteps(image.steps);
    if (!image.style || !modelConfigs?.[image.model]?.isPremium || isPro) {
      setStyle(image.style);
    } else {
      setStyle(null);
    }
  }

  if (image.quality === 'HD+' && !isPro) {
    setQuality('HD');
  } else {
    setQuality(image.quality);
  }

  const isPremiumRatio = ['9:21', '21:9', '3:2', '2:3', '4:5', '5:4', '10:16', '16:10'].includes(image.aspect_ratio);
  if (isPremiumRatio && !isPro) {
    setAspectRatio('1:1');
    setUseAspectRatio(true);
  } else {
    setAspectRatio(image.aspect_ratio);
    setUseAspectRatio(true);
  }

  setActiveTab('input');
  if (onClose) onClose();
};