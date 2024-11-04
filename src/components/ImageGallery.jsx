import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import SkeletonImageCard from './SkeletonImageCard'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import MobileImageDrawer from './MobileImageDrawer'
import ImageCard from './ImageCard'
import { useLikes } from '@/hooks/useLikes'
import MobileGeneratingStatus from './MobileGeneratingStatus'
import { useImageFilter } from '@/hooks/useImageFilter'
import NoResults from './NoResults'
import GalleryContent from './GalleryContent'

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
  showPrivate = false
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showImageInDrawer, setShowImageInDrawer] = useState(false);
  const { userLikes, toggleLike } = useLikes(userId);
  const { data: modelConfigs } = useModelConfigs();
  const isMobile = window.innerWidth <= 768;
  const { filterImages } = useImageFilter();

  const { data: images, isLoading, refetch } = useQuery({
    queryKey: ['images', userId, activeView, nsfwEnabled, activeFilters, searchQuery, showPrivate],
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return filterImages(data, {
        userId,
        activeView,
        nsfwEnabled,
        modelConfigs,
        activeFilters,
        searchQuery,
        showPrivate
      });
    },
    enabled: !!userId && !!modelConfigs,
  });

  useEffect(() => {
    refetch()
  }, [activeView, nsfwEnabled, refetch]);

  useEffect(() => {
    const channels = [
      supabase
        .channel('user_images_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_images' }, 
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const isNsfw = modelConfigs?.[payload.new.model]?.category === "NSFW";
              if (activeView === 'myImages') {
                if (nsfwEnabled) {
                  if (isNsfw && payload.new.user_id === userId) {
                    refetch();
                  }
                } else {
                  if (!isNsfw && payload.new.user_id === userId) {
                    refetch();
                  }
                }
              } else if (activeView === 'inspiration') {
                if (nsfwEnabled) {
                  if (isNsfw && payload.new.user_id !== userId) {
                    refetch();
                  }
                } else {
                  if (!isNsfw && payload.new.user_id !== userId) {
                    refetch();
                  }
                }
              }
            } else if (payload.eventType === 'DELETE') {
              refetch();
            }
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

    // Subscribe to all channels
    Promise.all(channels.map(channel => channel.subscribe()));

    // Cleanup function to unsubscribe from all channels
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [userId, activeView, nsfwEnabled, refetch, modelConfigs]);

  const handleImageClick = (image, index) => {
    if (window.innerWidth <= 768) {
      setSelectedImage(image);
      setShowImageInDrawer(true);
      setDrawerOpen(true);
    } else {
      onImageClick(image, index);
    }
  };

  const handleMoreClick = (image, e) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
      setSelectedImage(image);
      setShowImageInDrawer(false);
      setDrawerOpen(true);
    }
  };

  return (
    <>
      <GalleryContent
        images={images}
        isLoading={isLoading}
        userLikes={userLikes}
        toggleLike={toggleLike}
        userId={userId}
        isMobile={isMobile}
        onImageClick={onImageClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
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
