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
import { cn } from "@/lib/utils";

const ImageCard = ({ 
  image, 
  onDiscard = () => {}, 
  userId,
  isMobile,
  isLiked,
  onToggleLike = () => {},
}) => {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  const handleImageClick = (e) => {
    e.preventDefault();
    navigate(`/image/${image.id}`);
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
      onDiscard(image.id);
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
        className="mb-4 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className={cn(
          "overflow-hidden rounded-xl transition-all duration-200",
          "border border-border/20 bg-card/40",
          "backdrop-blur-sm shadow-[0_0_0_1px] shadow-border/10",
          "hover:shadow-[0_0_0_1px] hover:shadow-border/20",
          "hover:border-border/30"
        )}>
          <CardContent className="p-0 relative">
            <ImageStatusIndicators 
              isTrending={image.is_trending} 
              isHot={image.is_hot} 
            />
            <ImageCardMedia
              image={image}
              onImageClick={handleImageClick}
              onDoubleClick={handleDoubleClick}
              isAnimating={isAnimating}
              isHovered={isHovered}
            />
            <ImageCardBadges
              modelName={modelName}
              isNsfw={isNsfw}
            />
          </CardContent>
        </Card>
        <div className={cn(
          "mt-2 flex items-center justify-between",
          "transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-80"
        )}>
          <p className="text-sm truncate w-[70%] text-foreground/80">{image.prompt}</p>
          <ImageCardActions
            image={image}
            isMobile={isMobile}
            isLiked={isLiked}
            likeCount={likeCount}
            onToggleLike={onToggleLike}
            onViewDetails={() => setDetailsDialogOpen(true)}
            onDownload={handleDownload}
            onDiscard={handleDiscard}
            userId={userId}
          />
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