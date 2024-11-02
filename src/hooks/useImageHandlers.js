import { toast } from 'sonner'
import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useProUser } from '@/hooks/useProUser'

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
      toast.error('Please sign in to remix images');
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
      toast.info('Some settings were adjusted as they require a pro account');
    } else {
      setModel(image.model);
      setSteps(modelConfigs[image.model]?.defaultStep || 30);
    }

    // Handle quality settings
    if (image.quality === 'HD+' && !isPro) {
      setQuality('HD');
      toast.info('Quality adjusted to HD as HD+ requires a pro account');
    } else {
      setQuality(image.quality);
    }

    // Handle style
    const modelConfig = modelConfigs?.[image.model];
    if (modelConfig?.category === "NSFW") {
      setStyle(null); // Reset style for NSFW models
    } else if (image.style) {
      if (isPro) {
        setStyle(image.style);
      } else {
        setStyle(null);
        toast.info('Style was removed as it requires a pro account');
      }
    } else {
      setStyle(null);
    }

    // Handle aspect ratio
    const isPremiumRatio = ['9:21', '21:9', '3:2', '2:3', '4:5', '5:4', '10:16', '16:10'].includes(image.aspect_ratio);
    if (isPremiumRatio && !isPro) {
      setAspectRatio('1:1');
      setUseAspectRatio(true);
      toast.info('Aspect ratio adjusted as the original requires a pro account');
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
    if (confirm('Are you sure you want to delete this image?')) {
      await deleteImageCompletely(image.id);
      toast.success('Image deleted successfully');
      queryClient.invalidateQueries(['userImages']);
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