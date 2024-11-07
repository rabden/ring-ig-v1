import React from 'react';
import ImageCard from '../ImageCard';
import SkeletonImageCard from '../SkeletonImageCard';
import NoResults from '../NoResults';
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
};

const ImageList = ({
  images,
  isLoading,
  userId,
  onImageClick,
  onMoreClick,
  onDownload,
  onDiscard,
  onRemix,
  onViewDetails,
  isMobile,
  userLikes,
  toggleLike,
  setActiveTab,
  setStyle,
  style
}) => {
  if (isLoading) {
    return (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto"
        columnClassName="bg-clip-padding px-2"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonImageCard key={`loading-${index}`} />
        ))}
      </Masonry>
    );
  }

  if (!images || images.length === 0) {
    return <NoResults />;
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto md:px-2 -mx-1 md:mx-0"
      columnClassName="bg-clip-padding px-1 md:px-2"
    >
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onImageClick={() => onImageClick(image)}
          onMoreClick={onMoreClick}
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
      ))}
    </Masonry>
  );
};

export default ImageList;