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

    // Store the image data in sessionStorage for retrieval after navigation
    sessionStorage.setItem('pendingRemixImage', JSON.stringify(remixImage));

    // Navigate based on device type
    if (isMobile) {
      navigate('/', { state: { shouldRemix: true } });
    } else {
      // For desktop, always navigate to myImages view
      navigate('/?view=myImages', { state: { shouldRemix: true } });
    }

    // Close any open dialogs or drawers
    if (onClose) onClose();

    // Then perform the remix after navigation is complete
    setTimeout(() => {
      // Retrieve the stored image data
      const storedImage = sessionStorage.getItem('pendingRemixImage');
      if (storedImage) {
        const imageToRemix = JSON.parse(storedImage);
        if (typeof onRemix === 'function') {
          onRemix(imageToRemix);
        }
        // Clear the stored data
        sessionStorage.removeItem('pendingRemixImage');
      }

      // Switch to input tab
      setActiveTab('input');
    }, 100);
  };

  return { handleRemix };
};
