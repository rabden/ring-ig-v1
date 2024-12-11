import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useProUser } from '@/hooks/useProUser';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { isMobile } from '@/lib/utils';

export const useImageRemix = (session) => {
  const navigate = useNavigate();
  const { data: isPro = false } = useProUser(session?.user?.id);

  const handleRemix = (image) => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }

    // Clear any existing remix data before starting new remix
    sessionStorage.removeItem('remixData');
    
    // Navigate to remix route which will redirect based on device
    navigate(`/remix/${image.id}`, {
      state: { isMobile: isMobile() } // Pass device type to RemixRoute
    });
  };

  // Function to get and clear remix data
  const getAndClearRemixData = () => {
    try {
      const remixDataStr = sessionStorage.getItem('remixData');
      if (!remixDataStr) return null;

      const remixData = JSON.parse(remixDataStr);
      const now = Date.now();

      // Clear the data immediately to prevent reuse
      sessionStorage.removeItem('remixData');

      // Only return data if it's less than 10 seconds old
      if (now - remixData.timestamp < 10000) {
        // Remove timestamp from returned data
        const { timestamp, ...cleanData } = remixData;
        return cleanData;
      }
      return null;
    } catch (error) {
      console.error('Error parsing remix data:', error);
      sessionStorage.removeItem('remixData');
      return null;
    }
  };

  return { handleRemix, getAndClearRemixData };
};
