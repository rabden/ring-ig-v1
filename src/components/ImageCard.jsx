import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ImageStatusIndicators from './ImageStatusIndicators';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useQuery } from '@tanstack/react-query';
import { downloadImage } from '@/utils/downloadUtils';
import ImageCardActions from './ImageCardActions';
import { supabase } from '@/integrations/supabase/supabase';
import ImageDetailsDialog from './ImageDetailsDialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { handleImageDiscard } from '@/utils/discardUtils';
import ImageCardMedia from './image-card/ImageCardMedia';
import ImageCardBadges from './image-card/ImageCardBadges';
<<<<<<< HEAD
import { cn } from '@/lib/utils';
=======
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
>>>>>>> 66c2e013e88f56074c8c841ced1225f311f22095

<<<<<<< HEAD
const ImageCard = ({ 
  image, 
  onDiscard = () => {}, 
  onRemix = () => {}, 
  userId,
=======
const ImageCard = ({
  image,
>>>>>>> 66c2e013e88f56074c8c841ced1225f311f22095
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
  className = "",
}) => {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: modelConfigs } = useModelConfigs();
  const isMobileDevice = useMediaQuery('(max-width: 768px)');

  const { data: likeCount = 0 } = useQuery({
    queryKey: ['imageLikes', image.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('image_id', image.id);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const handleCardClick = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setDetailsDialogOpen(true);
=======
    if (typeof onViewDetails === 'function') {
      onViewDetails(image, false);
    }
>>>>>>> 66c2e013e88f56074c8c841ced1225f311f22095
  };

  const handleRemixClick = () => {
    if (typeof onRemix === 'function') {
      onRemix(image);
      setActiveTab('input');
    }
  };

  const handleDownload = async () => {
    const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
    await downloadImage(imageUrl, image.prompt);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLiked) {
      setIsAnimating(true);
      onToggleLike(image.id);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
  };

  const handleDiscard = async () => {
    try {
      setIsDeleted(true);
      await handleImageDiscard(image);
      onDiscard(image);
    } catch (error) {
      console.error('Error in handleDiscard:', error);
      setIsDeleted(false);
    }
  };

  if (isDeleted) return null;

  const isNsfw = modelConfigs?.[image.model]?.category === "NSFW";
  const modelName = modelConfigs?.[image.model]?.name || image.model;

  return (
    <>
<<<<<<< HEAD
      <div className="group relative rounded-lg overflow-hidden bg-background/50 hover:bg-background/80 transition-colors duration-200">
        <div 
          className="relative aspect-[1/1.5] overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={image.url}
            alt={image.prompt || "Generated image"}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onDoubleClick={handleDoubleClick}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-xs text-white/90 line-clamp-2 pr-2">
              {image.prompt}
            </div>
            <ImageCardActions
=======
      <div 
        className={cn(
          "group relative rounded-lg overflow-hidden bg-background/50 hover:bg-background/80 transition-colors duration-200",
          className
        )}
        onClick={handleCardClick}
      >
        <div className="relative aspect-[1/1.5] overflow-hidden">
          <img
            src={image.url}
            alt={image.prompt || "Generated image"}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-xs text-white/90 line-clamp-2 pr-2">
              {image.prompt}
            </div>
            <ImageCardActions
>>>>>>> 66c2e013e88f56074c8c841ced1225f311f22095
              image={image}
<<<<<<< HEAD
              isMobile={isMobile}
              isLiked={isLiked}
              likeCount={likeCount}
              onToggleLike={onToggleLike}
              onViewDetails={handleImageClick}
              onDownload={handleDownload}
              onDiscard={handleDiscard}
              onRemix={handleRemixClick}
              userId={userId}
              setStyle={null}
              setActiveTab={setActiveTab}
=======
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
>>>>>>> 66c2e013e88f56074c8c841ced1225f311f22095
            />
          </div>
        </div>
      </div>

      <ImageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        image={image}
      />
    </>
  );
};

export default ImageCard;