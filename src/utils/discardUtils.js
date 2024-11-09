import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const handleImageDiscard = async (image, queryClient) => {
  if (!image?.id) {
    toast.error('Invalid image data');
    return;
  }

  try {
    const { data: imageData, error: fetchError } = await supabase
      .from('user_images')
      .select('storage_path')
      .eq('id', image.id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching image:', fetchError);
      toast.error('Failed to verify image');
      return;
    }

    if (!imageData) {
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      }
      return;
    }

    const { error: storageError } = await supabase.storage
      .from('user-images')
      .remove([imageData.storage_path]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
      toast.error('Failed to delete image file');
      return;
    }

    const { error: dbError } = await supabase
      .from('user_images')
      .delete()
      .eq('id', image.id);

    if (dbError) {
      console.error('Error deleting from database:', dbError);
      toast.error('Failed to delete image record');
      return;
    }

    if (queryClient) {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    }

    toast.success('Image deleted successfully');
  } catch (error) {
    console.error('Error in handleImageDiscard:', error);
    toast.error('Failed to delete image');
  }
};