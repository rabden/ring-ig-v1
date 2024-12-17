import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useProUser } from '@/hooks/useProUser'
import { toast } from 'sonner'
import { handleImageDiscard } from '@/utils/discardUtils'
import { useNavigate } from 'react-router-dom'

export const useImageHandlers = ({
  generateImage,
  setSelectedImage,
  setFullScreenViewOpen,
  setModel,
  setPrompt,
  setSeed,
  setRandomizeSeed,
  setWidth,
  setHeight,
  setQuality,
  setAspectRatio,
  setUseAspectRatio,
  aspectRatios = [],
  session,
  queryClient,
  activeView,
  setDetailsDialogOpen,
  setActiveView,
}) => {
  const navigate = useNavigate();
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
    if (newModel === 'turbo' && (setQuality('HD+') || setQuality('4K'))) {
      setQuality('HD');
    }
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
    setModel(image.model);
    setQuality(image.quality);
    if (image.aspect_ratio) {
      setAspectRatio(image.aspect_ratio);
      setUseAspectRatio(true);
    }
    setActiveView('input');
    navigate('/#imagegenerate');
  }

  const handleDownload = async (imageUrl, prompt) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${prompt}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const handleDiscard = async (imageId) => {
    if (!imageId) {
      return;
    }
    
    try {
      await handleImageDiscard({ id: imageId }, queryClient);
    } catch (error) {
      console.error('Error deleting image:', error);
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