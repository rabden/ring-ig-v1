import React from 'react';
import { getCleanPrompt } from '@/utils/promptUtils';
import ImageCardActions from '../ImageCardActions';
import ShareButton from '../social/ShareButton';

const ImageCardFooter = ({
  image,
  isMobile,
  isLiked,
  likeCount,
  onToggleLike,
  onViewDetails,
  onDownload,
  onDiscard,
  onRemix,
  userId,
  setStyle,
  setActiveTab,
  imageUrl
}) => {
  return (
    <div className="mt-1 flex items-center justify-between">
      <p className="text-sm truncate w-[70%]">
        {getCleanPrompt(image.prompt, image.style)}
      </p>
      <div className="flex items-center gap-1">
        <ShareButton imageUrl={imageUrl} prompt={image.prompt} />
        <ImageCardActions
          image={image}
          isMobile={isMobile}
          isLiked={isLiked}
          likeCount={likeCount}
          onToggleLike={onToggleLike}
          onViewDetails={onViewDetails}
          onDownload={onDownload}
          onDiscard={onDiscard}
          onRemix={onRemix}
          userId={userId}
          setStyle={setStyle}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
};

export default ImageCardFooter;