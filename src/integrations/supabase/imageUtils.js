import { supabase } from './supabase';

export const deleteImageFromSupabase = async (imageId) => {
  try {
    // First, fetch the image record to get the storage_path
    const { data: imageRecord, error: fetchError } = await supabase
      .from('user_images')
      .select('storage_path')
      .eq('id', imageId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch image record: ${fetchError.message}`);
    }

    if (!imageRecord) {
      throw new Error('Image record not found');
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('user-images')
      .remove([imageRecord.storage_path]);

    if (storageError) {
      console.error('Failed to delete image from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
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