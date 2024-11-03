import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, UserCircle2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ImageStatusIndicators from './ImageStatusIndicators'
import { supabase } from '@/integrations/supabase/supabase'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useStyleConfigs } from '@/hooks/useStyleConfigs'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from "@/components/ui/skeleton"
import { downloadImage } from '@/utils/downloadUtils'
import { useProUser } from '@/hooks/useProUser'
import LikeButton from './LikeButton'
import { useNavigate } from 'react-router-dom'

const ImageCard = ({ 
  image, 
  onImageClick, 
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
  const navigate = useNavigate();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const imageSrc = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
  
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

  const handleDownload = async () => {
    try {
      await downloadImage(imageSrc, image.prompt);
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleProfileClick = () => {
    if (userProfile?.display_name) {
      navigate(`/profile/${userProfile.display_name}`);
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
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </CardContent>
      </Card>
      <div className="mt-1 flex items-center justify-between">
        <button 
          className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity"
          onClick={handleProfileClick}
        >
          <div className={`${isUserPro ? 'p-[2px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 rounded-full' : ''}`}>
            {userProfile?.avatar_url ? (
              <img 
                src={userProfile.avatar_url} 
                alt={userProfile?.display_name || 'Anonymous'}
                className={`w-5 h-5 rounded-full ${isUserPro ? 'border border-background' : ''}`}
              />
            ) : (
              <UserCircle2 className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {userProfile?.display_name || 'Anonymous'}
          </p>
        </button>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <LikeButton isLiked={isLiked} onToggle={() => onToggleLike(image.id)} />
            <span className="text-xs text-muted-foreground">{likeCount}</span>
          </div>
          {isMobile ? (
            <Button variant="ghost" className="h-6 w-6 p-0" onClick={() => onMoreClick(image)}>
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