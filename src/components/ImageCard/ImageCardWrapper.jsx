import React from 'react';
import { motion } from 'framer-motion';
import ImageCard from './ImageCard';

const ImageCardWrapper = ({ image, onImageClick, onMoreClick, onDownload, onDiscard, onRemix, onViewDetails, userId, isMobile, isLiked, onToggleLike }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="mb-2"
    >
      <ImageCard
        image={image}
        onImageClick={onImageClick}
        onMoreClick={onMoreClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
        userId={userId}
        isMobile={isMobile}
        isLiked={isLiked}
        onToggleLike={onToggleLike}
      />
    </motion.div>
  );
};

export default ImageCardWrapper;