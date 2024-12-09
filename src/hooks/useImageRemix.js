import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useProUser } from '@/hooks/useProUser';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const useImageRemix = (session, onRemix = () => {}, setActiveTab = () => {}, onClose = () => {}) => {
  const { data: styleConfigs } = useStyleConfigs();
  const { data: modelConfigs } = useModelConfigs();
  const { data: isPro = false } = useProUser(session?.user?.id);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleRemix = (image) => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }

    // Handle model mapping
    const remixImage = {
      ...image,
      // Map both 'ultra' and 'preLar' to 'preLar' to ensure consistency
      model: image.model === 'ultra' || image.model === 'preLar' ? 'preLar' : image.model
    };

    // Get current view from URL or default to empty
    const currentView = new URLSearchParams(location.search).get('view') || '';

    // Navigate based on device type and current view
    if (isMobile) {
      navigate('/');
    } else {
      // Always navigate to myImages view, regardless of current location
      navigate('/?view=myImages');
    }

    // Then perform the remix after a short delay to ensure navigation is complete
    setTimeout(() => {
      if (typeof onRemix === 'function') {
        onRemix(remixImage);
      }

      // Check if the original image was made with a NSFW model
      const isNsfwModel = modelConfigs?.[remixImage.model]?.category === "NSFW";

      setActiveTab('input');
      if (onClose) onClose();
    }, 100);
  };

  return { handleRemix };
};
