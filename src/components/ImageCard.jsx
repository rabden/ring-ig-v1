import React, { useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImageStatusIndicators from './ImageStatusIndicators';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { downloadImage } from '@/utils/downloadUtils';
import { useImageLoader } from '@/hooks/useImageLoader';
import ImageCardActions from './ImageCardActions';
import { supabase } from '@/integrations/supabase/supabase';
import MobileImageDrawer from './MobileImageDrawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ImageCard = ({ 
  image, 
  onImageClick, 
  onDiscard, 
  onRemix, 
  onViewDetails,
  userId,
  isMobile,
  isLiked,
  onToggleLike,
  setActiveTab,
  setStyle,
}) => {
  const imageRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const { imageLoaded, shouldLoad, imageSrc, setImageLoaded } = useImageLoader(imageRef, image);
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
      onToggleLike(image.id);
    }
  };

  const isNsfw = modelConfigs?.[image.model]?.category === "NSFW";
  const modelName = modelConfigs?.[image.model]?.name || image.model;
  const styleName = styleConfigs?.[image.style]?.name || 'General';

  return (
    <>
      <div className="mb-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
            <ImageStatusIndicators 
              isTrending={image.is_trending} 
              isHot={image.is_hot} 
            />
            <div ref={imageRef}>
              {(!imageLoaded || !shouldLoad) && (
                <div className="absolute inset-0 bg-muted animate-pulse">
                  <Skeleton className="w-full h-full" />
                </div>
              )}
              {shouldLoad && (
                <img 
                  src={imageSrc}
                  alt={image.prompt} 
                  className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onClick={handleImageClick}
                  onDoubleClick={handleDoubleClick}
                  onLoad={() => setImageLoaded(true)}
                  loading="lazy"
                />
              )}
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
          <p className="text-sm truncate w-[70%]">{image.prompt}</p>
          <ImageCardActions
            image={image}
            isMobile={isMobile}
            isLiked={isLiked}
            likeCount={likeCount}
            onToggleLike={onToggleLike}
            onViewDetails={() => setDrawerOpen(true)}
            onDownload={handleDownload}
            onDiscard={onDiscard}
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
          onDiscard={onDiscard}
          onRemix={handleRemixClick}
          isOwner={image.user_id === userId}
          setActiveTab={setActiveTab}
          setStyle={setStyle}
        />
      )}
    </>
  );
};

export default ImageCard;