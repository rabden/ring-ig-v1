import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const handleImageDiscard = async (image, queryClient) => {
  if (!image?.id) {
    toast.error('Invalid image data');
    return;
  }

  try {
    // First check if the image exists
    const { data: imageData, error: fetchError } = await supabase
      .from('user_images')
      .select('storage_path')
      .eq('id', image.id)
      .maybeSingle(); // Use maybeSingle instead of single to handle non-existent records

    if (fetchError) {
      console.error('Error fetching image:', fetchError);
      toast.error('Failed to verify image');
      return;
    }

    // If image doesn't exist in database, just invalidate queries
    if (!imageData) {
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      }
      return;
    }

    // Delete from storage first
    const { error: storageError } = await supabase.storage
      .from('user-images')
      .remove([imageData.storage_path]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
      toast.error('Failed to delete image file');
      return;
    }

    // Then delete from database
    const { error: dbError } = await supabase
      .from('user_images')
      .delete()
      .eq('id', image.id);

    if (dbError) {
      console.error('Error deleting from database:', dbError);
      toast.error('Failed to delete image record');
      return;
    }

    // Invalidate queries to refresh the UI
    if (queryClient) {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    }

    toast.success('Image deleted successfully');
  } catch (error) {
    console.error('Error in handleImageDiscard:', error);
    toast.error('Failed to delete image');
  }
};