import React from 'react';
import Masonry from 'react-masonry-css';
import ImageCard from './ImageCard';
import NoResults from './NoResults';
import SkeletonImageCard from './SkeletonImageCard';
import { useInView } from 'react-intersection-observer';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
};

const ImageList = ({ 
  data,
  isLoading,
  userId,
  onImageClick,
  onMoreClick,
  onDownload,
  onDiscard,
  onRemix,
  onViewDetails,
  userLikes,
  onToggleLike,
  isMobile,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
}) => {
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName="bg-clip-padding px-1 md:px-2"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonImageCard key={`loading-${index}`} />
        ))}
      </Masonry>
    );
  }

  if (!data?.pages || data.pages[0].images.length === 0) {
    return <NoResults />;
  }

  const allImages = data.pages.flatMap(page => page.images);

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName="bg-clip-padding px-1 md:px-2"
      >
        {allImages.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onImageClick={() => onImageClick(image)}
            onMoreClick={() => onMoreClick?.(image)}
            onDownload={onDownload}
            onDiscard={onDiscard}
            onRemix={onRemix}
            onViewDetails={onViewDetails}
            userId={userId}
            isMobile={isMobile}
            isLiked={userLikes?.includes(image.id)}
            onToggleLike={onToggleLike}
          />
        ))}
      </Masonry>

      {hasNextPage && (
        <div ref={ref} className="h-10 w-full" />
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
    </>
  );
};

export default ImageList;