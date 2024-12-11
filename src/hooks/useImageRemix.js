import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useProUser } from '@/hooks/useProUser';
import { toast } from 'sonner';

export const useImageRemix = (session, onRemix, onClose) => {
  const { data: modelConfigs } = useModelConfigs() || {};
  const { data: isPro = false } = useProUser(session?.user?.id);

  const handleRemix = (image) => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }

    if (onRemix && typeof onRemix === 'function') {
      onRemix(image);
    }
    
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  return { handleRemix };
};