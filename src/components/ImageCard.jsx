import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ImageStatusIndicators from './ImageStatusIndicators'
import { supabase } from '@/integrations/supabase/supabase'

const ImageCard = ({ 
  image, 
  onImageClick, 
  onMoreClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails,
  userId,
  isMobile 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = supabase.storage
    .from('user-images')
    .getPublicUrl(image.storage_path)
    .data.publicUrl;

  const handleImageError = () => {
    setImageError(true);
    console.error('Failed to load image:', image.storage_path);
  };

  return (
    <div className="mb-2">
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
          <ImageStatusIndicators 
            isTrending={image.is_trending} 
            isHot={image.is_hot} 
          />
          {!imageError ? (
            <img 
              src={imageUrl}
              alt={image.prompt} 
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              onClick={() => onImageClick(image)}
              onError={handleImageError}
              loading="lazy"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground">Image unavailable</p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-1 flex items-center justify-between">
        <p className="text-sm truncate w-[70%]">{image.prompt}</p>
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
              <DropdownMenuItem onClick={() => onDownload(imageUrl, image.prompt)}>
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
  )
}

export default ImageCard