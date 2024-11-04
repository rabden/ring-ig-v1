import React from 'react';
import ImageCard from '../ImageCard';
import SkeletonImageCard from '../SkeletonImageCard';
import NoResults from '../NoResults';

const GalleryContent = ({
  isLoading,
  images,
  handleImageClick,
  handleMoreClick,
  onDownload,
  onDiscard,
  onRemix,
  onViewDetails,
  userId,
  isMobile,
  userLikes,
  toggleLike,
  setActiveTab,
  setStyle,
  style
}) => {
  if (isLoading) {
    return Array.from({ length: 8 }).map((_, index) => (
      <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
    ));
  }
  
  if (!images || images.length === 0) {
    return <NoResults />;
  }
  
  return images.map((image, index) => (
    <ImageCard
      key={image.id}
      image={image}
      onImageClick={() => handleImageClick(image, index)}
      onMoreClick={handleMoreClick}
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

export default GalleryContent;