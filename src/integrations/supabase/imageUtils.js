import { supabase } from './supabase';

export const deleteImageFromStorage = async (storagePath) => {
  if (!storagePath) {
    throw new Error('Storage path is required for deletion');
  }

  try {
    const { error } = await supabase.storage
      .from('user-images')
      .remove([storagePath]);

    if (error) {
      throw new Error(`Failed to delete image from storage: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteImageFromStorage:', error);
    throw error;
  }
};

export const deleteImageRecord = async (imageId) => {
  if (!imageId) {
    throw new Error('Image ID is required for deletion');
  }

  try {
    const { error } = await supabase
      .from('user_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      throw new Error(`Failed to delete image record from database: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteImageRecord:', error);
    throw error;
  }
};

export const deleteImageCompletely = async (imageId) => {
  if (!imageId) {
    throw new Error('Image ID is required for deletion');
  }

  try {
    // First, fetch the image record to get the storage_path
    const { data: imageRecords, error: fetchError } = await supabase
      .from('user_images')
      .select('storage_path')
      .eq('id', imageId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch image record: ${fetchError.message}`);
    }

    if (!imageRecords) {
      throw new Error('Image record not found');
    }

    // Delete from storage first
    await deleteImageFromStorage(imageRecords.storage_path);

    // Then delete from database
    await deleteImageRecord(imageId);
  } catch (error) {
    console.error('Error in deleteImageCompletely:', error);
    throw error;
  }
};