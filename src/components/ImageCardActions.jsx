import React from 'react';
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LikeButton from './LikeButton';
import { toast } from 'sonner';

const ImageCardActions = ({ 
  image, 
  isMobile, 
  isLiked, 
  likeCount, 
  onToggleLike, 
  onViewDetails,
  onDownload,
  onDiscard,
  onRemix,
  userId
}) => {
  const handleMoreClick = (e) => {
    e.stopPropagation();
    if (isMobile) {
      onViewDetails(image);
    }
  };

  const handleDiscard = () => {
    if (!image?.id) {
      toast.error('Cannot delete image: Invalid image ID');
      return;
    }
    onDiscard(image);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1">
        <LikeButton isLiked={isLiked} onToggle={() => onToggleLike(image.id)} />
        <span className="text-xs text-muted-foreground">{likeCount}</span>
      </div>
      {isMobile ? (
        <Button variant="ghost" className="h-6 w-6 p-0" onClick={handleMoreClick}>
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
            <DropdownMenuItem onClick={onDownload}>
              Download
            </DropdownMenuItem>
            {image.user_id === userId && (
              <DropdownMenuItem onClick={handleDiscard}>
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
  );
};

export default ImageCardActions;