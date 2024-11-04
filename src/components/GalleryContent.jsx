import React from 'react';
import Masonry from 'react-masonry-css';
import ImageCard from './ImageCard';
import SkeletonImageCard from './SkeletonImageCard';
import NoResults from './NoResults';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
};

const GalleryContent = ({
  images,
  isLoading,
  userLikes,
  toggleLike,
  userId,
  isMobile,
  onImageClick,
  onDownload,
  onDiscard,
  onRemix,
  onViewDetails,
  setActiveTab,
  setStyle,
  style
}) => {
  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
      ));
    }
    
    if (!images || images.length === 0) {
      return [<NoResults key="no-results" />];
    }
    
    return images.map((image) => (
      <ImageCard
        key={image.id}
        image={image}
        onImageClick={() => onImageClick(image)}
        onMoreClick={(e) => e.stopPropagation()}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
        userId={userId}
        isMobile={isMobile}
        isLiked={userLikes.includes(image.id)}
        onToggleLike={toggleLike}
        setActiveTab={setActiveTab}
        setStyle={setStyle}
        style={style}
      />
    ));
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto md:px-2 -mx-1 md:mx-0"
      columnClassName="bg-clip-padding px-1 md:px-2"
    >
      {renderContent()}
    </Masonry>
  );
};

export default GalleryContent;