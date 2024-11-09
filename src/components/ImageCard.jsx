import React, { useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImageStatusIndicators from './ImageStatusIndicators';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { downloadImage } from '@/utils/downloadUtils';
import ImageCardActions from './ImageCardActions';
import { supabase } from '@/integrations/supabase/supabase';
import MobileImageDrawer from './MobileImageDrawer';
import ImageDetailsDialog from './ImageDetailsDialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { handleImageDiscard } from '@/utils/discardUtils';
import { getCleanPrompt } from '@/utils/promptUtils';
import { handleImageRemix } from '@/utils/remixUtils';
import { useProUser } from '@/hooks/useProUser';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const ImageCard = ({ 
  image, 
  onImageClick, 
  onDiscard, 
  userId,
  isMobile,
  isLiked,
  onToggleLike,
  setActiveTab,
  setStyle,
  setPrompt,
  setSeed,
  setRandomizeSeed,
  setWidth,
  setHeight,
  setModel,
  setSteps,
  setQuality,
  setAspectRatio,
  setUseAspectRatio
}) => {
  const imageRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const isMobileDevice = useMediaQuery('(max-width: 768px)');
  const { session } = useSupabaseAuth();
  const { data: isPro } = useProUser(session?.user?.id);
  
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

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    if (isMobileDevice) {
      setDrawerOpen(true);
    } else {
      onImageClick(image);
    }
  };

  const handleRemixClick = () => {
    handleImageRemix(image, {
      setPrompt,
      setSeed,
      setRandomizeSeed,
      setWidth,
      setHeight,
      setModel,
      setSteps,
      setStyle,
      setQuality,
      setAspectRatio,
      setUseAspectRatio,
      setActiveTab,
      modelConfigs,
      isPro
    });
  };

  const handleDownload = async () => {
    const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
    await downloadImage(imageUrl, image.prompt);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLiked) {
      onToggleLike(image.id);
    }
  };

  const handleDiscard = async () => {
    try {
      await handleImageDiscard(image);
      if (onDiscard) onDiscard(image.id);
    } catch (error) {
      console.error('Error in handleDiscard:', error);
    }
  };

  const handleViewDetails = (img, isMobileView = isMobileDevice) => {
    if (isMobileView) {
      setDrawerOpen(true);
    } else {
      setDetailsDialogOpen(true);
    }
  };

  const isNsfw = modelConfigs?.[image.model]?.category === "NSFW";
  const modelName = modelConfigs?.[image.model]?.name || image.model;
  const styleName = styleConfigs?.[image.style]?.name || 'General';

  const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;

  return (
    <>
      <div className="mb-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
            <ImageStatusIndicators 
              isTrending={image.is_trending} 
              isHot={image.is_hot} 
            />
            <div ref={imageRef} className="absolute inset-0">
              {isLoading && (
                <div className="absolute inset-0 bg-muted animate-pulse">
                  <Skeleton className="w-full h-full" />
                </div>
              )}
              <img 
                src={imageUrl}
                alt={image.prompt} 
                className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleImageClick}
                onDoubleClick={handleDoubleClick}
                onLoad={handleImageLoad}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute bottom-2 left-2 flex gap-1">
              <Badge variant="secondary" className="bg-black/50 text-white border-none text-[8px] md:text-[10px] py-0.5">
                {modelName}
              </Badge>
              {!isNsfw && (
                <Badge variant="secondary" className="bg-black/50 text-white border-none text-[8px] md:text-[10px] py-0.5">
                  {styleName}
                </Badge>
              )}
            </div>
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
            onViewDetails={handleViewDetails}
            onDownload={handleDownload}
            onDiscard={handleDiscard}
            onRemix={handleRemixClick}
            userId={userId}
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
          setPrompt={setPrompt}
          setSeed={setSeed}
          setRandomizeSeed={setRandomizeSeed}
          setWidth={setWidth}
          setHeight={setHeight}
          setModel={setModel}
          setSteps={setSteps}
          setQuality={setQuality}
          setAspectRatio={setAspectRatio}
          setUseAspectRatio={setUseAspectRatio}
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