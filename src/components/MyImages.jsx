import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import ImageGallery from './ImageGallery'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { downloadImage } from '@/utils/downloadUtils'

const MyImages = ({ userId }) => {
  const navigate = useNavigate();

  const handleImageClick = (image) => {
    navigate(`/image/${image.id}`);
  };

  const handleDownload = async (imageUrl, prompt) => {
    try {
      await downloadImage(imageUrl, prompt);
      toast.success('Image downloaded successfully');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleDiscard = async (image) => {
    try {
      const { error } = await supabase
        .from('user_images')
        .delete()
        .eq('id', image.id);
      
      if (error) throw error;
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleRemix = (image) => {
    navigate(`/remix/${image.id}`);
  };

  const handleViewDetails = (image) => {
    navigate(`/image/${image.id}`);
  };

  return (
    <ImageGallery
      userId={userId}
      activeView="myImages"
      onImageClick={handleImageClick}
      onDownload={handleDownload}
      onDiscard={handleDiscard}
      onRemix={handleRemix}
      onViewDetails={handleViewDetails}
    />
  );
};

export default MyImages;