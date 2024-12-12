import { useModelConfigs } from '@/hooks/useModelConfigs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const useImageRemix = (session, onRemix, onClose, isPro = false) => {
  const { data: modelConfigs } = useModelConfigs() || {};
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleRemix = (image) => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }

    // Check if the image uses premium features
    const model = modelConfigs?.[image.model];
    const isPremiumModel = model?.isPremium;
    const isPremiumQuality = image.quality === 'HD+' || image.quality === '4K';
    const premiumAspectRatios = ['9:21', '21:9', '3:2', '2:3', '4:5', '5:4', '10:16', '16:10'];
    const isPremiumAspectRatio = premiumAspectRatios.includes(image.aspect_ratio);

    // If user is not pro and image uses premium features, show warning
    if (!isPro && (isPremiumModel || isPremiumQuality || isPremiumAspectRatio)) {
      let adjustedSettings = [];
      
      if (isPremiumModel) {
        adjustedSettings.push('model (will use Ring.1)');
      }
      if (isPremiumQuality) {
        adjustedSettings.push('quality (will use HD)');
      }
      if (isPremiumAspectRatio) {
        adjustedSettings.push('aspect ratio (will use 1:1)');
      }

      toast.warning(`Some premium settings will be adjusted: ${adjustedSettings.join(', ')}`);
    }

    if (onRemix && typeof onRemix === 'function') {
      // Modify image settings for non-pro users
      const remixImage = { ...image };
      if (!isPro) {
        if (isPremiumModel) {
          remixImage.model = 'flux'; // Default to non-premium model
        }
        if (isPremiumQuality) {
          remixImage.quality = 'HD'; // Default to HD quality
        }
        if (isPremiumAspectRatio) {
          remixImage.aspect_ratio = '1:1'; // Default to 1:1 aspect ratio
          // Adjust width and height to maintain 1:1 ratio
          const size = Math.min(remixImage.width, remixImage.height);
          remixImage.width = size;
          remixImage.height = size;
        }
      }
      onRemix(remixImage);
    }
    
    if (onClose && typeof onClose === 'function') {
      onClose();
    }

    // Navigate with remix parameter before the hash
    const hash = isMobile ? '#imagegenerate' : '#myimages';
    navigate(`/?remix=${image.id}${hash}`, { replace: true });
  };

  return { handleRemix };
};