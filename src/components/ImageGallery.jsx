import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import MobileImageDrawer from './MobileImageDrawer';
import { useLikes } from '@/hooks/useLikes';
import MobileGeneratingStatus from './MobileGeneratingStatus';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useGalleryData } from '@/hooks/useGalleryData';
import ImageList from './gallery/ImageList';
import { toast } from 'sonner';

const ImageGallery = ({ 
  userId, 
  onImageClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails, 
  activeView, 
  generatingImages = [], 
  nsfwEnabled,
  activeFilters = {},
  searchQuery = '',
  setActiveTab,
  setStyle,
  style,
  showPrivate
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showImageInDrawer, setShowImageInDrawer] = useState(false);
  const { userLikes, toggleLike } = useLikes(userId);
  const { data: modelConfigs } = useModelConfigs();
  const isMobile = window.innerWidth <= 768;
  const { session } = useSupabaseAuth();

  const { data: images, isLoading, refetch } = useGalleryData({
    userId,
    activeView,
    nsfwEnabled,
    activeFilters,
    searchQuery,
    showPrivate,
    session,
    modelConfigs
  });

  useEffect(() => {
    if (!session?.user?.id) {
      toast.error('Please sign in to view images');
      return;
    }

    const channels = [
      supabase
        .channel('user_images_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_images' }, 
          (payload) => {
            refetch();
          }
        ),
      supabase
        .channel('user_image_likes_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_image_likes' },
          () => {
            refetch();
          }
        )
    ];

    Promise.all(channels.map(channel => channel.subscribe()));

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [session?.user?.id, refetch]);

  const handleImageClick = (image) => {
    if (isMobile) {
      setSelectedImage(image);
      setShowImageInDrawer(true);
      setDrawerOpen(true);
    } else {
      onImageClick(image);
    }
  };

  const handleMoreClick = (image, e) => {
    e.stopPropagation();
    if (isMobile) {
      setSelectedImage(image);
      setShowImageInDrawer(false);
      setDrawerOpen(true);
    }
  };

  return (
    <>
      <ImageList
        images={images}
        isLoading={isLoading}
        userId={userId}
        onImageClick={handleImageClick}
        onMoreClick={handleMoreClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
        isMobile={isMobile}
        userLikes={userLikes}
        toggleLike={toggleLike}
        setActiveTab={setActiveTab}
        setStyle={setStyle}
        style={style}
      />

      <MobileImageDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        image={selectedImage}
        showImage={showImageInDrawer}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        isOwner={selectedImage?.user_id === userId}
        setActiveTab={setActiveTab}
        setStyle={setStyle}
        style={style}
      />

      <MobileGeneratingStatus generatingImages={generatingImages} />
    </>
  );
};

export default ImageGallery;