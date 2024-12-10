import React from 'react';
import Masonry from 'react-masonry-css';
import ImageCard from '../ImageCard';
import { cn } from '@/lib/utils';

const getBreakpointColumns = (activeView) => ({
  default: activeView === 'myImages' ? 4 : 5,
  1600: activeView === 'myImages' ? 4 : 5,
  1200: 4,
  700: 2,
  500: 2
});

const MasonryGrid = ({
  images,
  lastImageRef,
  onImageClick,
  onDownload,
  onDiscard,
  onRemix,
  onViewDetails,
  handleMobileMoreClick,
  userId,
  isMobile,
  userLikes,
  toggleLike,
  setActiveTab,
  setStyle,
  style,
  activeView,
  className
}) => {
  const breakpointColumnsObj = getBreakpointColumns(activeView);

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={cn(
        "flex w-auto md:px-2 -mx-1 md:mx-0",
        activeView === 'myImages' && "md:mt-8",
        className
      )}
      columnClassName="bg-clip-padding px-1 md:px-2 space-y-6"
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          ref={index === images.length - 1 ? lastImageRef : null}
          className="mb-6"
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
      ))}
    </Masonry>
  );
};

export default MasonryGrid;