import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ImageCard from './ImageCard';
import { SkeletonImageGrid } from './image-card/SkeletonImageCard';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import NoResults from './NoResults';

const REVEAL_INTERVAL = 150; // ms between each image reveal

const ImageGallery = ({
  userId,
  onImageClick,
  onDownload,
  onDiscard,
  onRemix,
  activeView,
  nsfwEnabled,
  activeFilters,
  searchQuery,
  showPrivate,
  isLiked,
  onToggleLike,
  setActiveTab
}) => {
  const { ref: loadMoreRef, inView } = useInView();
  const [visibleCount, setVisibleCount] = useState(0);
  const [allImages, setAllImages] = useState([]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useGalleryImages({
    userId,
    activeView,
    nsfwEnabled,
    activeFilters,
    searchQuery,
    showPrivate
  });

  // Update allImages when new data arrives
  useEffect(() => {
    if (data?.pages) {
      const newImages = data.pages.flatMap(page => page.images) || [];
      setAllImages(newImages);
      // If this is the first batch, start revealing images
      if (visibleCount === 0) {
        setVisibleCount(1);
      }
    }
  }, [data]);

  // Gradually reveal images
  useEffect(() => {
    if (visibleCount < allImages.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, REVEAL_INTERVAL);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, allImages.length]);

  // Load more when scrolling near bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <SkeletonImageGrid />;
  }

  if (allImages.length === 0) {
    return <NoResults />;
  }

  const visibleImages = allImages.slice(0, visibleCount);
  const remainingInBatch = allImages.length - visibleCount;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleImages.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onImageClick={onImageClick}
            onDownload={onDownload}
            onDiscard={onDiscard}
            onRemix={onRemix}
            userId={userId}
            isLiked={isLiked}
            onToggleLike={onToggleLike}
            setActiveTab={setActiveTab}
          />
        ))}
        {remainingInBatch > 0 && Array(Math.min(remainingInBatch, 8))
          .fill(null)
          .map((_, index) => (
            <div key={`skeleton-${index}`} className="animate-fade-in">
              <SkeletonImageGrid />
            </div>
          ))}
      </div>
      
      {isFetchingNextPage && <SkeletonImageGrid />}
      
      <div ref={loadMoreRef} className="h-4" />
    </div>
  );
};

export default ImageGallery;