import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const useRemixNavigation = (setPrompt, setSeed, setModel, setQuality, setWidth, setHeight, setAspectRatio, setUseAspectRatio, setActiveTab) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageId } = useParams();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleRemixRedirect = (image) => {
    if (!image) return;
    
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
    
    sessionStorage.setItem('remixData', JSON.stringify(remixData));
    
    if (isMobile) {
      navigate('/#imagegenerate');
    } else {
      navigate('/#myimages');
    }
  };

  useEffect(() => {
    const remixData = sessionStorage.getItem('remixData');
    if (remixData) {
      const data = JSON.parse(remixData);
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
      
      sessionStorage.removeItem('remixData');
    }
  }, [location.hash]);

  return { handleRemixRedirect };
};