import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { toast } from 'sonner';

export const useRemixNavigation = (setPrompt, setSeed, setModel, setQuality, setWidth, setHeight, setAspectRatio, setUseAspectRatio, setActiveTab) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleRemixRedirect = (image) => {
    if (!image) {
      toast.error('No image data available for remix');
      return;
    }
    
    const remixData = {
      prompt: image.prompt,
      seed: image.seed,
      model: image.model,
      quality: image.quality,
      width: image.width,
      height: image.height,
      aspectRatio: image.aspect_ratio,
      useAspectRatio: !!image.aspect_ratio
    };
    
    // Store remix data in sessionStorage
    sessionStorage.setItem('remixData', JSON.stringify(remixData));
    
    // Navigate based on device type
    if (isMobile) {
      navigate('/#imagegenerate');
    } else {
      navigate('/#myimages');
    }

    // Show success toast
    toast.success('Image settings loaded for remix');
  };

  useEffect(() => {
    const remixData = sessionStorage.getItem('remixData');
    if (remixData) {
      try {
        const data = JSON.parse(remixData);
        
        // Set all the image generation parameters
        setPrompt(data.prompt);
        setSeed(data.seed);
        setModel(data.model);
        setQuality(data.quality);
        setWidth(data.width);
        setHeight(data.height);
        setAspectRatio(data.aspectRatio);
        setUseAspectRatio(data.useAspectRatio);
        
        if (isMobile) {
          setActiveTab('input');
        }
        
        // Clear the stored data to prevent reapplying on subsequent navigation
        sessionStorage.removeItem('remixData');
      } catch (error) {
        console.error('Error parsing remix data:', error);
        toast.error('Failed to load remix settings');
      }
    }
  }, [location.hash, setPrompt, setSeed, setModel, setQuality, setWidth, setHeight, setAspectRatio, setUseAspectRatio, setActiveTab, isMobile]);

  return { handleRemixRedirect };
};