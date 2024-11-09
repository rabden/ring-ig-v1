import React, { useEffect, useRef, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import SkeletonImageCard from './SkeletonImageCard';
import ImageCard from './ImageCard';
import { useLikes } from '@/hooks/useLikes';
import NoResults from './NoResults';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import { AlertTriangle } from 'lucide-react';

const ImageLoadError = React.memo(({ onRetry }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-border/30">
    <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
    <p className="text-sm text-muted-foreground mb-2">Failed to load image</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-xs text-primary hover:underline"
      >
        Retry
      </button>
    )}
  </div>
));

const MemoizedImageCard = React.memo(ImageCard);

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
  const { userLikes, toggleLike } = useLikes(userId);
  const isMobile = window.innerWidth <= 768;
  
  const { 
    images, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch 
  } = useGalleryImages({
    userId,
    activeView,
    nsfwEnabled,
    showPrivate,
    activeFilters,
    searchQuery
  });

  const handleMobileMoreClick = useCallback((image) => {
    if (isMobile) {
      onViewDetails(image);
    }
  }, [isMobile, onViewDetails]);

  const Cell = useCallback(({ columnIndex, rowIndex, style: gridStyle, data }) => {
    const index = rowIndex * data.columnCount + columnIndex;
    const image = data.images[index];

    if (!image) return null;

    return (
      <div style={gridStyle}>
        <MemoizedImageCard
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
          fallback={<ImageLoadError onRetry={() => refetch()} />}
        />
      </div>
    );
  }, [onImageClick, onDownload, onDiscard, onRemix, onViewDetails, handleMobileMoreClick, userId, isMobile, userLikes, toggleLike, setActiveTab, setStyle, style, refetch]);

  if (isLoading && !images.length) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return <NoResults />;
  }

  return (
    <div className="h-screen">
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = width < 768 ? 2 : width < 1024 ? 3 : 4;
          const columnWidth = width / columnCount;
          const rowCount = Math.ceil(images.length / columnCount);
          const rowHeight = columnWidth;

          return (
            <Grid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={width}
              itemData={{
                images,
                columnCount
              }}
            >
              {Cell}
            </Grid>
          );
        }}
      </AutoSizer>
      {isFetchingNextPage && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageGallery);