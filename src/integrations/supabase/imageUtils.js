import { supabase } from './supabase';
import { toast } from 'sonner';

export const deleteImageFromStorage = async (storagePath) => {
  if (!storagePath) {
    throw new Error('Storage path is required for deletion');
  }

  const { error } = await supabase.storage
    .from('user-images')
    .remove([storagePath]);

  if (error) {
    throw new Error(`Failed to delete image from storage: ${error.message}`);
  }
};

export const deleteImageRecord = async (imageId) => {
  if (!imageId) {
    throw new Error('Image ID is required for database record deletion');
  }

  const { error } = await supabase
    .from('user_images')
    .delete()
    .eq('id', imageId);

  if (error) {
    throw new Error(`Failed to delete image record from database: ${error.message}`);
  }
};

export const getImageRecord = async (imageId) => {
  if (!imageId) {
    throw new Error('Image ID is required');
  }

  const { data, error } = await supabase
    .from('user_images')
    .select('storage_path')
    .eq('id', imageId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch image record: ${error.message}`);
  }

  return data;
};

export const deleteImageCompletely = async (imageId) => {
  if (!imageId) {
    throw new Error('Image ID is required for deletion');
  }

  // First, fetch the image record to get the storage path
  const imageRecord = await getImageRecord(imageId);

  if (!imageRecord?.storage_path) {
    // If the image record doesn't exist, we can consider it already deleted
    toast.error('Image not found or already deleted');
    return;
  }

  // Delete the image from storage first
  await deleteImageFromStorage(imageRecord.storage_path);

  // Then delete the database record
  await deleteImageRecord(imageId);
};