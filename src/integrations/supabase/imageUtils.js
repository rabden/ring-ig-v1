import { supabase } from './supabase';

export const deleteImageFromStorage = async (storagePath) => {
  try {
    const { error } = await supabase.storage
      .from('user-images')
      .remove([storagePath]);

    if (error) {
      throw new Error(`Failed to delete image from storage: ${error.message}`);
    }

    console.log('Image deleted successfully from storage');
  } catch (error) {
    console.error('Error in deleteImageFromStorage:', error);
    throw error;
  }
};

export const deleteImageRecord = async (imageId) => {
  try {
    const { error } = await supabase
      .from('user_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      throw new Error(`Failed to delete image record from database: ${error.message}`);
    }

    console.log('Image record deleted successfully from database');
  } catch (error) {
    console.error('Error in deleteImageRecord:', error);
    throw error;
  }
};

export const deleteImageCompletely = async (imageId) => {
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
    await deleteImageFromStorage(imageRecord.storage_path);

    // Delete from database
    await deleteImageRecord(imageId);

    console.log('Image deleted successfully from both storage and database');
  } catch (error) {
    console.error('Error in deleteImageCompletely:', error);
    throw error;
  }
};