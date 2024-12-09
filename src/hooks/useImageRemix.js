import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useProUser } from '@/hooks/useProUser';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const useImageRemix = (session, onRemix, setActiveTab, onClose) => {
  const { data: styleConfigs } = useStyleConfigs();
  const { data: modelConfigs } = useModelConfigs();
  const { data: isPro = false } = useProUser(session?.user?.id);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleRemix = (image) => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }

    // Handle model mapping
    const remixImage = {
      ...image,
      // Ensure we use 'preLar' for both pre-lar and ultra images
      model: image.model === 'ultra' ? 'preLar' : image.model
    };

    // Navigate based on device type
    if (isMobile) {
      navigate('/');
    } else {
      navigate('/?view=myImages');
    }

    // Then perform the remix after a short delay to ensure navigation is complete
    setTimeout(() => {
      onRemix(remixImage);

      // Check if the original image was made with a NSFW model
      const isNsfwModel = modelConfigs?.[remixImage.model]?.category === "NSFW";

      setActiveTab('input');
      if (onClose) onClose();
    }, 100);
  };

  return { handleRemix };
};
