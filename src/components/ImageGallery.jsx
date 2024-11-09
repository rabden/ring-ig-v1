import React, { useEffect, useRef, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import SkeletonImageCard from './SkeletonImageCard';
import ImageCard from './ImageCard';
import { useLikes } from '@/hooks/useLikes';
import NoResults from './NoResults';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import Feed from './Feed';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
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
  setStyle,
  style,
  showPrivate
}) => {
  if (activeView === 'feed') {
    return (
      <Feed
        userId={userId}
        onImageClick={onImageClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
        setActiveTab={setActiveTab}
        setStyle={setStyle}
        style={style}
      />
    );
  }

  const { userLikes, toggleLike } = useLikes(userId);
  const isMobile = window.innerWidth <= 768;
  
  const { 
    images, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useGalleryImages({
    userId,
    activeView,
    nsfwEnabled,
    showPrivate,
    activeFilters,
    searchQuery
  });

  // Scroll to top when view changes or filters update
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView, activeFilters, searchQuery, showPrivate]);

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

  const renderContent = () => {
    if (isLoading && !images.length) {
      return Array.from({ length: 8 }).map((_, index) => (
        <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
      ));
    }
    
    if (!images || images.length === 0) {
      return [<NoResults key="no-results" />];
    }
    
    return images.map((image, index) => (
      <div
        key={image.id}
        ref={index === images.length - 1 ? lastImageRef : null}
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
          setStyle={setStyle}
          style={style}
        />
      </div>
    ));
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName="bg-clip-padding px-1 md:px-2"
      >
        {renderContent()}
      </Masonry>
      {isFetchingNextPage && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;