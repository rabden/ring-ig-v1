import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ImageStatusIndicators from './ImageStatusIndicators';
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import LikeButton from './LikeButton';
import { useQuery } from '@tanstack/react-query';
import UserProfileMenu from './profile/UserProfileMenu';
import { useProUser } from '@/hooks/useProUser';
import ImageCardAvatar from './ImageCardAvatar';
import ImageCardContent from './ImageCardContent';

const ImageCard = ({ 
  image, 
  onImageClick, 
  onMoreClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails,
  userId,
  isMobile,
  isLiked,
  onToggleLike
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const imageRef = useRef(null);
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  
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

  const { data: imageOwner } = useQuery({
    queryKey: ['imageOwner', image.user_id],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', image.user_id)
        .single();
      
      if (error) throw error;
      return profile;
    },
    enabled: !!image.user_id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const { data: isOwnerPro } = useProUser(image.user_id);

  const checkVisibility = useCallback(() => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const verticalMargin = windowHeight;
    
    const isVisible = (
      rect.top <= windowHeight + verticalMargin &&
      rect.bottom >= -verticalMargin
    );

    if (isVisible && !shouldLoad) {
      setShouldLoad(true);
      setImageSrc(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl);
    }
  }, [shouldLoad, image.storage_path]);

  useEffect(() => {
    checkVisibility();
    const scrollHandler = () => {
      window.requestAnimationFrame(checkVisibility);
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', checkVisibility);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [checkVisibility]);

  const isNsfw = modelConfigs?.[image.model]?.category === "NSFW";
  const modelName = modelConfigs?.[image.model]?.name || image.model;
  const styleName = styleConfigs?.[image.style]?.name || 'General';

  const displayName = imageOwner?.display_name || 'Anonymous';
  const truncatedName = displayName.length > 15 ? `${displayName.slice(0, 15)}...` : displayName;

  const UserProfileTrigger = React.memo(React.forwardRef(({ onClick }, ref) => (
    <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onClick} ref={ref}>
      <ImageCardAvatar imageOwner={imageOwner} isOwnerPro={isOwnerPro} />
      <span className="text-xs font-medium truncate">{truncatedName}</span>
    </div>
  )));

  UserProfileTrigger.displayName = 'UserProfileTrigger';

  return (
    <div className="mb-2">
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
          <ImageStatusIndicators 
            isTrending={image.is_trending} 
            isHot={image.is_hot} 
          />
          <ImageCardContent
            imageRef={imageRef}
            imageLoaded={imageLoaded}
            shouldLoad={shouldLoad}
            imageSrc={imageSrc}
            image={image}
            onImageClick={onImageClick}
            onToggleLike={onToggleLike}
            isLiked={isLiked}
            modelName={modelName}
            styleName={styleName}
            isNsfw={isNsfw}
            setImageLoaded={setImageLoaded}
          />
        </CardContent>
      </Card>
      <div className="mt-1 flex items-center justify-between">
        <UserProfileMenu
          userId={image.user_id}
          trigger={<UserProfileTrigger />}
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="flex items-center gap-1">
            <LikeButton isLiked={isLiked} onToggle={() => onToggleLike(image.id)} />
            <span className="text-xs text-muted-foreground">{likeCount}</span>
          </div>
          {isMobile ? (
            <Button variant="ghost" className="h-6 w-6 p-0" onClick={(e) => onMoreClick(image, e)}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownload(imageSrc, image.prompt)}>
                  Download
                </DropdownMenuItem>
                {image.user_id === userId && (
                  <DropdownMenuItem onClick={() => onDiscard(image)}>
                    Discard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onRemix(image)}>
                  Remix
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewDetails(image)}>
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ImageCard);