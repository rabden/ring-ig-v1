import React, { useRef, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import SkeletonImageCard from './SkeletonImageCard';
import ImageCard from './ImageCard';
import DateGroupedGallery from './DateGroupedGallery';
import { useLikes } from '@/hooks/useLikes';
import NoResults from './NoResults';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import { cn } from '@/lib/utils';

const getBreakpointColumns = (activeView) => {
  if (activeView === 'inspiration' || activeView === 'profile') {
    return {
      default: 5,
      1600: 5,
      1200: 4,
      700: 2,
      500: 2
    };
  }
  return {
    default: 4,
    1100: 3,
    700: 2,
    500: 2
  };
};

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
  showPrivate,
  profileUserId,
  className
}) => {
  const { userLikes, toggleLike } = useLikes(userId);
  const isMobile = window.innerWidth <= 768;
  const breakpointColumnsObj = getBreakpointColumns(activeView);
  
  const { 
    images, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useGalleryImages({
    userId: profileUserId || userId,
    activeView,
    nsfwEnabled,
    showPrivate,
    activeFilters,
    searchQuery
  });

  const observer = useRef();
  const lastImageRef = useCallback(node => {
    if (isLoading || isFetchingNextPage) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleMobileMoreClick = (image) => {
    if (isMobile) {
      onViewDetails(image);
    }
  };

  // Filter images based on privacy setting
  const filteredImages = images?.filter(img => {
    if (activeView === 'myImages') {
      return showPrivate ? img.is_private : !img.is_private;
    }
    return !img.is_private;
  }) || [];

  if (isLoading && !images?.length) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {[...Array(12)].map((_, i) => (
          <SkeletonImageCard key={`loading-${i}`} width={512} height={512} />
        ))}
      </div>
    );
  }

  if (!filteredImages.length) {
    return <NoResults />;
  }

  // Use DateGroupedGallery for My Images view
  if (activeView === 'myImages') {
    return (
      <DateGroupedGallery
        images={filteredImages}
        onImageClick={(index) => onImageClick(filteredImages[index])}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
        className="p-4"
      />
    );
  }

  // Regular masonry layout for other views
  return (
    <div className={cn(
      "w-full h-full",
      "md:px-0",
      "md:pt-0",
      "pt-12",
      className
    )}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName="bg-clip-padding px-1 md:px-2"
      >
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            ref={index === filteredImages.length - 1 ? lastImageRef : null}
          >
            <ImageCard
              image={image}
              onImageClick={() => onImageClick(image)}
              onDownload={onDownload}
              onDiscard={onDiscard}
              onRemix={onRemix}
              onViewDetails={onViewDetails}
              onMoreClick={handleMobileMoreClick}
              userId={userId}
              isMobile={isMobile}
              isLiked={userLikes.includes(image.id)}
              onToggleLike={toggleLike}
              setActiveTab={setActiveTab}
            />
          </div>
        ))}
      </Masonry>
      {isFetchingNextPage && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;