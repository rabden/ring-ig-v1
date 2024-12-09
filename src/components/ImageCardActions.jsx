import React from 'react';
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LikeButton from './LikeButton';
import { useImageRemix } from '@/hooks/useImageRemix';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const ImageCardActions = ({ 
  image, 
  isMobile, 
  isLiked, 
  likeCount = 0, 
  onToggleLike = () => {},
  onViewDetails = () => {},
  onDownload = () => {},
  onDiscard = () => {},
  onRemix = () => {},
  userId,
  setStyle,
  setActiveTab
}) => {
  const { session } = useSupabaseAuth();
  const { handleRemix } = useImageRemix(session, onRemix, setStyle, setActiveTab, () => {});

  const handleMoreClick = (e) => {
    e.stopPropagation();
    if (isMobile && typeof onViewDetails === 'function') {
      onViewDetails(image);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (!isMobile && typeof onViewDetails === 'function') {
      onViewDetails(image, false);
    }
  };

  const handleDiscard = () => {
    if (!image?.id) return;
    onDiscard(image);
  };

  return (
    <div className="flex items-center gap-1">
      {session && (
        <div className="flex items-center gap-1">
          <LikeButton isLiked={isLiked} onToggle={() => onToggleLike(image.id)} />
          <span className="text-xs text-muted-foreground">{likeCount}</span>
        </div>
      )}
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
            {session && image.user_id === userId && (
              <DropdownMenuItem onClick={handleDiscard}>
                Discard
              </DropdownMenuItem>
            )}
            {session && (
              <DropdownMenuItem onClick={() => handleRemix(image)}>
                Remix
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleViewDetails}>
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ImageCardActions;