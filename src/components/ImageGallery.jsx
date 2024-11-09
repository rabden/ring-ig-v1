import React from 'react';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import ImageCard from './ImageCard';
import { toast } from "@/components/ui/use-toast";
import NoResults from './NoResults';
import SkeletonImageCard from './SkeletonImageCard';

const ImageGallery = ({
  userId,
  onImageClick,
  onDownload,
  onDiscard,
  onRemix,
  onViewDetails,
  activeView,
  generatingImages,
  nsfwEnabled,
  modelConfigs,
  activeFilters,
  searchQuery,
  setActiveTab,
  setStyle,
  showPrivate
}) => {
  const {
    images,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error
  } = useGalleryImages({
    userId,
    activeView,
    nsfwEnabled,
    showPrivate,
    activeFilters,
    searchQuery
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load images. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <SkeletonImageCard key={i} />
        ))}
      </div>
    );
  }

  if (!images?.length && !generatingImages?.length) {
    return <NoResults />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {generatingImages?.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            isGenerating={true}
            userId={userId}
            onImageClick={onImageClick}
            onDownload={onDownload}
            onDiscard={onDiscard}
            onRemix={onRemix}
            onViewDetails={onViewDetails}
            setActiveTab={setActiveTab}
            setStyle={setStyle}
          />
        ))}
        {images?.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            userId={userId}
            onImageClick={onImageClick}
            onDownload={onDownload}
            onDiscard={onDiscard}
            onRemix={onRemix}
            onViewDetails={onViewDetails}
            setActiveTab={setActiveTab}
            setStyle={setStyle}
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;