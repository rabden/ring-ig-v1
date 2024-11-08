import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useStyleConfigs } from '@/hooks/useStyleConfigs'
import { useProUser } from '@/hooks/useProUser'
import { toast } from 'sonner'

export const useImageHandlers = ({
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
  aspectRatios,
  session,
  queryClient,
  activeView,
  setDetailsDialogOpen,
  setActiveView,
  generateImage = () => {} // Provide default empty function
}) => {
  const { data: modelConfigs } = useModelConfigs() || {};
  const { data: styleConfigs } = useStyleConfigs() || {};
  const { data: isPro } = useProUser(session?.user?.id) || {};

  const handleDownload = async (image) => {
    if (!session) {
      toast.error('Please sign in to download images');
      return;
    }
    const a = document.createElement('a');
    a.href = image.url;
    a.download = `${image.prompt}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
  };

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

    // Check if the original image was made with a pro model
    const isProModel = modelConfigs?.[image.model]?.isPremium;
    const isNsfwModel = modelConfigs?.[image.model]?.category === "NSFW";

    // Set model based on NSFW status and pro status
    if (isNsfwModel) {
      setModel('nsfwMaster');
      setSteps(modelConfigs?.['nsfwMaster']?.defaultStep || 30);
    } else if (isProModel && !isPro) {
      setModel('turbo');
      setSteps(modelConfigs?.['turbo']?.defaultStep || 4);
    } else {
      setModel(image.model);
      setSteps(image.steps);
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
  };

  return {
    handleImageClick: (image) => {
      setSelectedImage(image);
      setFullScreenViewOpen(true);
    },
    handleDownload,
    handleDiscard,
    handleRemix,
    handleViewDetails: (image) => {
      setSelectedImage(image);
      setDetailsDialogOpen(true);
    },
  };
};