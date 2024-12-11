import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useProUser } from '@/hooks/useProUser';
import { toast } from 'sonner';

export const useImageRemix = (session, onRemix, setActiveTab, onClose) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: isPro = false } = useProUser(session?.user?.id);

  const handleRemix = (image) => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }

    onRemix(image);
    setActiveTab('input');
    onClose();
  };

  return { handleRemix };
};
