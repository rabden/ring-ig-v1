import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useProUser } from '@/hooks/useProUser'
import { toast } from 'sonner'
import { getCleanPrompt } from '@/utils/promptUtils'

export const useImageHandlers = ({
  generateImage,
  setSelectedImage,
  setFullScreenViewOpen,
  setModel,
  setSteps,
  setPrompt,
  setSeed,
  setRandomizeSeed,
  setWidth,
  setHeight,
  setQuality,
  setAspectRatio,
  setUseAspectRatio,
  setStyle,
  aspectRatios,
  session,
  queryClient,
  activeView,
  setDetailsDialogOpen,
  setActiveView,
}) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: isPro } = useProUser(session?.user?.id);

  const handleGenerateImage = async () => {
    await generateImage()
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setFullScreenViewOpen(true)
  }

  const handleModelChange = (newModel) => {
    setModel(newModel)
  }

  const handlePromptKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await handleGenerateImage()
    }
  }

  const handleRemix = (image) => {
    if (!session) {
      return;
    }

    // Clean the prompt by removing any style suffix
    setPrompt(getCleanPrompt(image.user_prompt || image.prompt, image.style));
    setSeed(image.seed);
    setRandomizeSeed(false);
    setWidth(image.width);
    setHeight(image.height);

    // Check if the original image was made with a pro model
    const isProModel = modelConfigs?.[image.model]?.isPremium;
    const isNsfwModel = modelConfigs?.[image.model]?.category === "NSFW";

    // Set model based on NSFW status and pro status
    if (isNsfwModel) {
      // For NSFW images, always use nsfwMaster for non-pro users
      setModel('nsfwMaster');
      setSteps(modelConfigs['nsfwMaster']?.defaultStep || 30);
      if (typeof setStyle === 'function') {
        setStyle(null);
      }
    } else if (isProModel && !isPro) {
      // For non-NSFW pro models, fallback to turbo for non-pro users
      setModel('turbo');
      setSteps(modelConfigs['turbo']?.defaultStep || 4);
      if (typeof setStyle === 'function') {
        setStyle(null);
      }
    } else {
      // Keep the original model if user has access to it
      setModel(image.model);
      setSteps(image.steps);
      if (typeof setStyle === 'function') {
        setStyle(image.style);
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
      setUseAspectRatio(image.aspect_ratio in aspectRatios);
    }
  }

  const handleDownload = async (imageUrl, prompt) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${prompt}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const handleDiscard = async (image) => {
    if (!image?.id) {
      toast.error('Cannot delete image: Invalid image ID');
      return;
    }
    
    try {
      await deleteImageCompletely(image.id);
      queryClient.invalidateQueries(['userImages']);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  }

  const handleViewDetails = (image) => {
    setSelectedImage(image);
    setDetailsDialogOpen(true);
  }

  return {
    handleImageClick,
    handleModelChange,
    handlePromptKeyDown,
    handleRemix,
    handleDownload,
    handleDiscard,
    handleViewDetails,
  }
}