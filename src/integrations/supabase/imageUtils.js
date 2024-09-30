import { supabase } from './supabase';

export const deleteImageFromSupabase = async (imageId, imageUrl) => {
  // Extract the path from the full URL
  const path = imageUrl.split('/').slice(-2).join('/');

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('user-images')
    .remove([path]);

  if (storageError) {
    throw new Error(`Failed to delete image from storage: ${storageError.message}`);
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('user_images')
    .delete()
    .eq('id', imageId);

  if (dbError) {
    throw new Error(`Failed to delete image record from database: ${dbError.message}`);
  }
};