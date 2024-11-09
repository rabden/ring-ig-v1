import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const handleImageDiscard = async (image, queryClient) => {
  if (!image?.id) {
    toast.error('Cannot delete image: Invalid image ID');
    return;
  }

  try {
    // First, fetch the image record to get the storage path
    const { data: imageRecord, error: fetchError } = await supabase
      .from('user_images')
      .select('storage_path')
      .eq('id', image.id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch image record: ${fetchError.message}`);
    }

    if (!imageRecord?.storage_path) {
      throw new Error('Image record or storage path not found');
    }

    // Delete the image from storage first
    const { error: storageError } = await supabase.storage
      .from('user-images')
      .remove([imageRecord.storage_path]);

    if (storageError) {
      throw new Error(`Failed to delete image from storage: ${storageError.message}`);
    }

    // Then delete the database record
    const { error: deleteError } = await supabase
      .from('user_images')
      .delete()
      .eq('id', image.id);

    if (deleteError) {
      throw new Error(`Failed to delete image record: ${deleteError.message}`);
    }

    // Invalidate queries to refresh the UI
    if (queryClient) {
      queryClient.invalidateQueries(['userImages']);
      queryClient.invalidateQueries(['galleryImages']);
    }

    toast.success('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    toast.error('Failed to delete image');
    throw error;
  }
};