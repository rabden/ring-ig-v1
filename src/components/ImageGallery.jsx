import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLikes } from '@/hooks/useLikes';
import { useSimpleImageFetch } from '@/hooks/useSimpleImageFetch';
import ImageList from './ImageList';
import MobileImageDrawer from './MobileImageDrawer';
import MobileGeneratingStatus from './MobileGeneratingStatus';
import { supabase } from '@/integrations/supabase/supabase';

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
  setStyle
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showImageInDrawer, setShowImageInDrawer] = useState(false);
  const { userLikes, toggleLike } = useLikes(userId);
  const isMobile = window.innerWidth <= 768;

  // Intersection Observer for infinite scroll
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useSimpleImageFetch({
    userId,
    activeView,
    nsfwEnabled,
    activeFilters
  });

  // Scroll to top when data changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data, activeView]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    refetch();
  }, [activeView, nsfwEnabled, refetch]);

  const handleImageClick = (image) => {
    if (isMobile) {
      setSelectedImage(image);
      setShowImageInDrawer(true);
      setDrawerOpen(true);
    } else {
      onImageClick(image);
    }
  };

  const handleMoreClick = (image) => {
    if (isMobile) {
      setSelectedImage(image);
      setShowImageInDrawer(false);
      setDrawerOpen(true);
    }
  };

  return (
    <div>
      <ImageList
        data={data}
        isLoading={isLoading}
        userId={userId}
        onImageClick={handleImageClick}
        onMoreClick={handleMoreClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
        userLikes={userLikes}
        onToggleLike={toggleLike}
        isMobile={isMobile}
      />

      {!isLoading && hasNextPage && (
        <div ref={ref} className="h-10 w-full" />
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

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
      />

      <MobileGeneratingStatus generatingImages={generatingImages} />
    </div>
  );
};

export default ImageGallery;