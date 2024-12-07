import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ImageCard from './ImageCard';
import { SkeletonImageGrid } from './image-card/SkeletonImageCard';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import NoResults from './NoResults';

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

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <SkeletonImageGrid />;
  }

  const images = data?.pages.flatMap(page => page.images) || [];

  if (images.length === 0) {
    return <NoResults />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
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
      </div>
      
      {isFetchingNextPage && <SkeletonImageGrid />}
      
      <div ref={loadMoreRef} className="h-4" />
    </div>
  );
};

export default ImageGallery;