import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, UserCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ImageStatusIndicators from './ImageStatusIndicators'
import { supabase } from '@/integrations/supabase/supabase'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useStyleConfigs } from '@/hooks/useStyleConfigs'
import LikeButton from './LikeButton'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from "@/components/ui/skeleton"
import { downloadImage } from '@/utils/downloadUtils'
import { Link } from 'react-router-dom'
import { useProUser } from '@/hooks/useProUser'

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
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const imageSrc = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
  
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

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', image.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', image.user_id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: isUserPro } = useProUser(image.user_id);

  const isNsfw = modelConfigs?.[image.model]?.category === "NSFW";
  const modelName = modelConfigs?.[image.model]?.name || image.model;
  const styleName = styleConfigs?.[image.style]?.name || 'General';
  const displayName = userProfile?.display_name || 'Anonymous';

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLiked) {
      onToggleLike(image.id);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadImage(imageSrc, image.prompt);
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="mb-2">
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
          <ImageStatusIndicators 
            isTrending={image.is_trending} 
            isHot={image.is_hot} 
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse">
              <Skeleton className="w-full h-full" />
            </div>
          )}
          <img 
            src={imageSrc}
            alt={image.prompt} 
            className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => onImageClick(image)}
            onDoubleClick={handleDoubleClick}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
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
        <Link 
          to={`/profile/${image.user_id}`} 
          className="flex items-center gap-2 flex-1 min-w-0 group"
        >
          <div className={`relative ${isUserPro ? 'p-[2px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 rounded-full' : ''}`}>
            {userProfile?.avatar_url ? (
              <img 
                src={userProfile.avatar_url} 
                alt={displayName}
                className={`w-5 h-5 rounded-full ${isUserPro ? 'border border-background' : ''}`}
              />
            ) : (
              <UserCircle2 className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate group-hover:text-foreground transition-colors">
            {displayName}
          </p>
        </Link>
        <div className="flex items-center gap-1">
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
                <DropdownMenuItem onClick={handleDownload}>
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

export default ImageCard;