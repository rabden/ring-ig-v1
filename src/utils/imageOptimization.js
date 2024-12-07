import { supabase } from '@/integrations/supabase/supabase';

export const getOptimizedImageUrl = (storagePath, options = {}) => {
  const {
    width = 'auto',
    quality = 75,
    format = 'webp'
  } = options;

  const baseUrl = supabase.storage.from('user-images').getPublicUrl(storagePath).data.publicUrl;
  
  // Add Supabase image transformation parameters
  const transformUrl = new URL(baseUrl);
  
  if (width !== 'auto') {
    transformUrl.searchParams.set('width', width);
  }
  
  transformUrl.searchParams.set('quality', quality);
  transformUrl.searchParams.set('format', format);
  
  return transformUrl.toString();
};

export const getResponsiveImageUrl = (storagePath) => {
  return {
    small: getOptimizedImageUrl(storagePath, { width: 640, quality: 70, format: 'webp' }),
    medium: getOptimizedImageUrl(storagePath, { width: 1024, quality: 75, format: 'webp' }),
    large: getOptimizedImageUrl(storagePath, { width: 1920, quality: 80, format: 'webp' }),
    original: getOptimizedImageUrl(storagePath, { quality: 85, format: 'webp' })
  };
};

export const generateBlurHash = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating blur hash:', error);
    return null;
  }
};