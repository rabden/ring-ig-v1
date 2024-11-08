import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useProUser } from '@/hooks/useProUser'
import { toast } from 'sonner'
import { getCleanPrompt } from '@/utils/promptUtils'
import { aspectRatios } from '@/utils/imageConfigs'

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
  session,
  queryClient,
  activeView,
  setDetailsDialogOpen,
  setActiveView,
}) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: isPro = false } = useProUser(session?.user?.id);

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

    setPrompt(getCleanPrompt(image.user_prompt || image.prompt, image.style));
    setSeed(image.seed);
    setRandomizeSeed(false);
    setWidth(image.width);
    setHeight(image.height);

    const isProModel = modelConfigs?.[image.model]?.isPremium;
    const isNsfwModel = modelConfigs?.[image.model]?.category === "NSFW";

    if (isNsfwModel) {
      setModel('nsfwMaster');
      setSteps(modelConfigs['nsfwMaster']?.defaultStep || 30);
      if (typeof setStyle === 'function') {
        setStyle(null);
      }
    } else if (isProModel && !isPro) {
      setModel('turbo');
      setSteps(modelConfigs['turbo']?.defaultStep || 4);
      if (typeof setStyle === 'function') {
        setStyle(null);
      }
    } else {
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

    // Always set the aspect ratio from the image being remixed
    if (image.aspect_ratio && image.aspect_ratio in aspectRatios) {
      setAspectRatio(image.aspect_ratio);
      setUseAspectRatio(true);
    } else {
      // If the image doesn't have a valid aspect ratio, calculate it from dimensions
      const ratio = `${image.width}:${image.height}`;
      if (ratio in aspectRatios) {
        setAspectRatio(ratio);
        setUseAspectRatio(true);
      } else {
        // Default to 1:1 if no matching aspect ratio is found
        setAspectRatio('1:1');
        setUseAspectRatio(true);
      }
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