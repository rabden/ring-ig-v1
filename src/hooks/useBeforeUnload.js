import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useBeforeUnload = (generatingImages, session) => {
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      if (generatingImages.length > 0) {
        e.preventDefault();
        e.returnValue = '';

        // Use sendBeacon to ensure the request goes through even during page unload
        const payload = {
          user_id: session?.user?.id,
          generation_ids: generatingImages.map(img => img.id)
        };

        // Create a blob from the payload
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        
        // Use sendBeacon to send the data
        navigator.sendBeacon('/api/track-incomplete-generations', blob);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [generatingImages, session?.user?.id]);
};