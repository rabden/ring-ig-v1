import { supabase } from './supabase';

export const deleteImageFromSupabase = async (imageId, imageUrl) => {
  try {
    // Extract the path from the full URL
    const bucketName = 'user-images';
    const path = imageUrl.replace(`${supabase.supabaseUrl}/storage/v1/object/public/${bucketName}/`, '');

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(bucketName)
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

    console.log('Image deleted successfully from both storage and database');
  } catch (error) {
    console.error('Error in deleteImageFromSupabase:', error);
    throw error;
  }
};