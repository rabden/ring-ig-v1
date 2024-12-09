import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useProUser } from '@/hooks/useProUser';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const useImageRemix = (session, onRemix = () => {}, setActiveTab = () => {}, onClose = () => {}) => {
  const { data: modelConfigs } = useModelConfigs();
  const navigate = useNavigate();

  const handleRemix = (image) => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }

    // Close any open dialogs or drawers first
    if (onClose) onClose();

    // Navigate to the remix route
    navigate(`/remix/${image.id}`);
  };

  return { handleRemix };
};
