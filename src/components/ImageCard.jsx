import React, { useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import MobileImageDrawer from './MobileImageDrawer';
import ImageDetailsDialog from './ImageDetailsDialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { handleImageDiscard } from '@/utils/discardUtils';
import { toast } from 'sonner';
import ImageCardContent from './image-card/ImageCardContent';
import ImageCardFooter from './image-card/ImageCardFooter';

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
  const imageRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const isMobileDevice = useMediaQuery('(max-width: 768px)');
  const queryClient = useQueryClient();

  const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
  
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

  const handleImageLoad = () => setIsLoading(false);

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
      await handleImageDiscard(image, queryClient);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error in handleDiscard:', error);
      setIsDeleted(false);
      toast.error('Failed to delete image');
    }
  };

  const handleViewDetails = (img, isMobileView = isMobileDevice) => {
    if (isMobileView) {
      setDrawerOpen(true);
    } else {
      setDetailsDialogOpen(true);
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
          <CardContent className="p-0">
            <ImageCardContent
              image={image}
              imageUrl={imageUrl}
              isLoading={isLoading}
              handleImageLoad={handleImageLoad}
              handleImageClick={handleImageClick}
              handleDoubleClick={handleDoubleClick}
              isAnimating={isAnimating}
              modelName={modelName}
              styleName={styleName}
              isNsfw={isNsfw}
            />
          </CardContent>
        </Card>
        <ImageCardFooter
          image={image}
          isMobile={isMobile}
          isLiked={isLiked}
          likeCount={likeCount}
          onToggleLike={onToggleLike}
          onViewDetails={handleViewDetails}
          onDownload={handleDownload}
          onDiscard={handleDiscard}
          onRemix={handleRemixClick}
          userId={userId}
          setStyle={setStyle}
          setActiveTab={setActiveTab}
          imageUrl={imageUrl}
        />
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