import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useProUser } from '@/hooks/useProUser';
import { toast } from 'sonner';
import { getCleanPrompt } from '@/utils/promptUtils';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { supabase } from '@/integrations/supabase/supabase';

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
  aspectRatios,
  session,
  queryClient,
  activeView,
  setDetailsDialogOpen,
  setActiveView,
  setStyle,
}) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const { data: isPro = false } = useProUser(session?.user?.id);

  const handleGenerateImage = async () => {
    if (generateImage) {
      await generateImage();
    }
  };

  const handleImageClick = (image) => {
    if (setSelectedImage && setFullScreenViewOpen) {
      setSelectedImage(image);
      setFullScreenViewOpen(true);
    }
  };

  const handleModelChange = (newModel) => {
    if (setModel && setSteps) {
      setModel(newModel);
      if (newModel === 'turbo') {
        setSteps(4);
      }
    }
  };

  const handlePromptKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleGenerateImage();
    }
  };

  const handleRemix = (image) => {
    if (!image) return;

    const cleanPrompt = getCleanPrompt(image.prompt, image.style);
    if (setPrompt) {
      setPrompt(cleanPrompt);
    }

    if (setSeed && setRandomizeSeed) {
      setSeed(image.seed);
      setRandomizeSeed(false);
    }

    if (setWidth && setHeight) {
      setWidth(image.width);
      setHeight(image.height);
    }

    if (setQuality) {
      setQuality(image.quality);
    }

    if (setModel && modelConfigs) {
      setModel(image.model);
      setSteps(image.steps);
      
      if (typeof setStyle === 'function') {
        const isStylePremium = styleConfigs?.[image.style]?.isPremium;
        if (!isStylePremium || isPro) {
          setStyle(image.style);
        } else {
          setStyle(null);
        }
      }
    }

    if (image.aspect_ratio && setAspectRatio && setUseAspectRatio) {
      setAspectRatio(image.aspect_ratio);
      setUseAspectRatio(true);
    }
  };

  const handleDownload = async (image) => {
    if (!image?.storage_path) {
      toast.error('Cannot download image: Invalid image path');
      return;
    }

    try {
      const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getCleanPrompt(image.prompt, image.style).slice(0, 30)}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleDiscard = async (image) => {
    if (!image?.id) {
      toast.error('Cannot delete image: Invalid image ID');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_images')
        .delete()
        .eq('id', image.id)
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      queryClient.invalidateQueries(['userImages']);
      queryClient.invalidateQueries(['galleryImages']);

      if (activeView === 'myImages') {
        setActiveView('trending');
      }

    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  const handleViewDetails = (image) => {
    if (setSelectedImage && setDetailsDialogOpen) {
      setSelectedImage(image);
      setDetailsDialogOpen(true);
    }
  };

  return {
    handleGenerateImage,
    handleImageClick,
    handleModelChange,
    handlePromptKeyDown,
    handleRemix,
    handleDownload,
    handleDiscard,
    handleViewDetails,
  };
};
