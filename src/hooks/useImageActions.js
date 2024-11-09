import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/supabase';

export const useImageActions = ({
  setSelectedImage,
  setFullScreenViewOpen,
  setDetailsDialogOpen,
  session,
  queryClient,
}) => {
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setFullScreenViewOpen(true);
  };

  const handleDownload = async (image) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleDiscard = async (image) => {
    if (!session || session.user.id !== image.user_id) return;
    
    try {
      const { error } = await supabase
        .from('user_images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['userImages'] });
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleViewDetails = (image) => {
    setSelectedImage(image);
    setDetailsDialogOpen(true);
  };

  return {
    handleImageClick,
    handleDownload,
    handleDiscard,
    handleViewDetails,
  };
};