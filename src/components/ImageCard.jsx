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
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ImageCard = ({
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
  className = "",
}) => {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: modelConfigs } = useModelConfigs();
  const isMobileDevice = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

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
    if (typeof onViewDetails === 'function') {
      onViewDetails(image, false);
    }
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