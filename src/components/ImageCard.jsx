import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ImageStatusIndicators from './ImageStatusIndicators';
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import LikeButton from './LikeButton';
import { useQuery } from '@tanstack/react-query';
import UserProfileMenu from './profile/UserProfileMenu';
import { useProUser } from '@/hooks/useProUser';
import CachedAvatar from './profile/CachedAvatar';
import { Skeleton } from "@/components/ui/skeleton";

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
    staleTime: Infinity,
    cacheTime: 30 * 60 * 1000,
  });

  const { data: isOwnerPro } = useProUser(image.user_id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true);
            setImageSrc(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl);
          }
        });
      },
      {
        rootMargin: '100% 0px',
        threshold: 0
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [shouldLoad, image.storage_path]);

  const isNsfw = modelConfigs?.[image.model]?.category === "NSFW";
  const modelName = modelConfigs?.[image.model]?.name || image.model;
  const styleName = styleConfigs?.[image.style]?.name || 'General';

  const displayName = imageOwner?.display_name || 'Anonymous';
  const truncatedName = displayName.length > 15 ? `${displayName.slice(0, 15)}...` : displayName;

  const UserProfileTrigger = React.memo(({ onClick, forwardedRef }) => (
    <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onClick} ref={forwardedRef}>
      <CachedAvatar
        src={imageOwner?.avatar_url}
        alt={displayName}
        isPro={isOwnerPro}
      />
      <span className="text-xs font-medium truncate">{truncatedName}</span>
    </div>
  ));

  UserProfileTrigger.displayName = 'UserProfileTrigger';

  return (
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
                onClick={() => onImageClick(image)}
                onDoubleClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!isLiked) onToggleLike(image.id); }}
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