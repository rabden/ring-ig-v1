import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useImageLoader = (imageRef, image) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (!image?.storage_path) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true);
            setImageSrc(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [image.storage_path, shouldLoad]);

  return { imageLoaded, shouldLoad, imageSrc, setImageLoaded };
};