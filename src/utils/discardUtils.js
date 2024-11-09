import { supabase } from '@/integrations/supabase/supabase';

export const handleImageDiscard = async (image, queryClient) => {
  if (!image?.id) {
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
      console.error('Error deleting image from storage:', storageError);
      return;
    }

    const { error: dbError } = await supabase
      .from('user_images')
      .delete()
      .eq('id', image.id);

    if (dbError) {
      console.error('Error deleting image from database:', dbError);
      return;
    }

    if (queryClient) {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    }
  } catch (error) {
    console.error('Error in handleImageDiscard:', error);
  }
};