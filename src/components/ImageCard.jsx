import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ImageStatusIndicators from './ImageStatusIndicators'
import { supabase } from '@/integrations/supabase/supabase'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useStyleConfigs } from '@/hooks/useStyleConfigs'
import LikeButton from './LikeButton'
import { useQuery } from '@tanstack/react-query'

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

  const isNsfw = modelConfigs?.[image.model]?.category === "NSFW";
  const modelName = modelConfigs?.[image.model]?.name || image.model;
  const styleName = styleConfigs?.[image.style]?.name || 'General';

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLiked) {
      onToggleLike(image.id);
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
          <img 
            src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
            alt={image.prompt} 
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            onClick={() => onImageClick(image)}
            onDoubleClick={handleDoubleClick}
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
        <p className="text-sm truncate w-[70%]">{image.prompt}</p>
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
                <DropdownMenuItem onClick={() => onDownload(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl, image.prompt)}>
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
  )
}

export default ImageCard