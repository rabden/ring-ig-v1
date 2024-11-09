import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ImageStatusIndicators from './ImageStatusIndicators';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useQuery } from '@tanstack/react-query';
import { downloadImage } from '@/utils/downloadUtils';
import ImageCardActions from './ImageCardActions';
import { supabase } from '@/integrations/supabase/supabase';
import MobileImageDrawer from './MobileImageDrawer';
import ImageDetailsDialog from './ImageDetailsDialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { handleImageDiscard } from '@/utils/discardUtils';
import { getCleanPrompt } from '@/utils/promptUtils';
import { toast } from 'sonner';
import ImageCardMedia from './image-card/ImageCardMedia';
import ImageCardBadges from './image-card/ImageCardBadges';

const ImageCard = ({ 
  image, 
  onImageClick, 
  onDiscard, 
  onRemix, 
  userId,
  isMobile,
  isLiked,
  onToggleLike,
  setActiveTab,
  setStyle,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
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

  const handleImageClick = (e) => {
    e.preventDefault();
    if (isMobileDevice) {
      setDrawerOpen(true);
    } else {
      onImageClick(image);
    }
  };

  const handleRemixClick = () => {
    if (typeof onRemix === 'function' && typeof setStyle === 'function') {
      onRemix(image);
      setStyle(image.style);
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
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error in handleDiscard:', error);
      setIsDeleted(false);
      toast.error('Failed to delete image');
    }
  };

  if (isDeleted) return null;

  const isNsfw = modelConfigs?.[image.model]?.category === "NSFW";
  const modelName = modelConfigs?.[image.model]?.name || image.model;
  const styleName = styleConfigs?.[image.style]?.name || 'General';

  return (
    <>
      <div className="mb-2">
        <Card className="overflow-hidden">
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
            />
            <ImageCardBadges
              modelName={modelName}
              styleName={styleName}
              isNsfw={isNsfw}
            />
          </CardContent>
        </Card>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm truncate w-[70%]">{getCleanPrompt(image.prompt, image.style)}</p>
          <ImageCardActions
            image={image}
            isMobile={isMobile}
            isLiked={isLiked}
            likeCount={likeCount}
            onToggleLike={onToggleLike}
            onDownload={handleDownload}
            onDiscard={handleDiscard}
            onRemix={handleRemixClick}
            userId={userId}
            setStyle={setStyle}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {isMobileDevice && (
        <MobileImageDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          image={image}
          showFullImage={true}
          onDownload={handleDownload}
          onDiscard={handleDiscard}
          onRemix={handleRemixClick}
          isOwner={image.user_id === userId}
          setActiveTab={setActiveTab}
          setStyle={setStyle}
        />
      )}

      <ImageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        image={image}
      />
    </>
  );
};

export default ImageCard;