import React, { useState, useEffect, useRef } from 'react'
import Masonry from 'react-masonry-css'
import SkeletonImageCard from './SkeletonImageCard'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import MobileImageDrawer from './MobileImageDrawer'
import ImageCard from './ImageCard'
import { useLikes } from '@/hooks/useLikes'
import MobileGeneratingStatus from './MobileGeneratingStatus'
import NoResults from './NoResults'
import { useImagePagination } from '@/hooks/useImagePagination'
import { useInView } from 'react-intersection-observer'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

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
  showTopFilter // Add this prop
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showImageInDrawer, setShowImageInDrawer] = useState(false);
  const { userLikes, toggleLike } = useLikes(userId);
  const { data: modelConfigs } = useModelConfigs();
  const isMobile = window.innerWidth <= 768;
  const galleryRef = useRef(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const {
    images,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useImagePagination(
    userId,
    activeView,
    nsfwEnabled,
    activeFilters,
    searchQuery,
    modelConfigs,
    showTopFilter // Pass showTopFilter to useImagePagination
  );

  // Scroll to top when content changes
  useEffect(() => {
    if (galleryRef.current) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [activeView, activeFilters, searchQuery, nsfwEnabled, generatingImages.length]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    refetch();
  }, [activeView, nsfwEnabled, refetch]);

  const handleImageClick = (image, index) => {
    if (isMobile) {
      setSelectedImage(image);
      setShowImageInDrawer(true);
      setDrawerOpen(true);
    } else {
      onImageClick(image, index);
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

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
      ));
    }
    
    if (!images || images.length === 0) {
      return [<NoResults key="no-results" />];
    }
    
    return images.map((image, index) => (
      <ImageCard
        key={image.id}
        image={image}
        onImageClick={() => handleImageClick(image, index)}
        onMoreClick={handleMoreClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
        userId={userId}
        isMobile={isMobile}
        isLiked={userLikes.includes(image.id)}
        onToggleLike={toggleLike}
      />
    ));
  };

  return (
    <>
      <div ref={galleryRef}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto md:px-2 -mx-1 md:mx-0"
          columnClassName="bg-clip-padding px-1 md:px-2"
        >
          {renderContent()}
        </Masonry>

        {hasNextPage && (
          <div ref={ref} className="flex justify-center mt-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>

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
    </>
  );
};

export default ImageGallery;