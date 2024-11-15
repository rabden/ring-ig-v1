import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useProUser } from '@/hooks/useProUser';
import { toast } from 'sonner';

export const useImageRemix = (session) => {
  const { data: styleConfigs } = useStyleConfigs();
  const { data: modelConfigs } = useModelConfigs();
  const { data: isPro = false } = useProUser(session?.user?.id);

  const handleRemix = (image, onRemix, setStyle, setActiveTab, onClose) => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }

    if (onRemix) {
      onRemix(image);
    }

    // Check if the original image was made with a pro style
    const isProStyle = styleConfigs?.[image.style]?.isPremium;
    const isNsfwModel = modelConfigs?.[image.model]?.category === "NSFW";

    // Set style based on NSFW status and pro status
    if (isNsfwModel) {
      // For NSFW models, don't use any style
      setStyle?.(null);
    } else if (isProStyle && !isPro) {
      // If it's a pro style and user is not pro, reset to no style
      setStyle?.(null);
    } else {
      // Otherwise keep the original style
      setStyle?.(image.style);
    }

    if (setActiveTab) {
      setActiveTab('input');
    }
    
    if (onClose) {
      onClose();
    }
  };

  return { handleRemix };
};
