import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useProUser } from '@/hooks/useProUser'
import { toast } from "sonner"

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
      toast.error("Cannot delete image: Invalid image ID");
      return;
    }
    
    try {
      await deleteImageCompletely(image.id);
      queryClient.invalidateQueries(['userImages']);
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error(`Failed to delete image: ${error.message}`);
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