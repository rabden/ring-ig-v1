import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useBeforeUnload = (generatingImages) => {
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      if (generatingImages?.length > 0) {
        // Create a payload with the current generating images
        const payload = {
          generating_images: generatingImages,
          timestamp: new Date().toISOString(),
          user_id: (await supabase.auth.getUser()).data?.user?.id
        };

        // Use sendBeacon to ensure the request is sent even if the page is closing
        navigator.sendBeacon(
          '/api/track-incomplete-generations',
          JSON.stringify(payload)
        );

        // Show a warning to the user
        event.preventDefault();
        event.returnValue = 'You have images being generated. Are you sure you want to leave?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [generatingImages]);
};