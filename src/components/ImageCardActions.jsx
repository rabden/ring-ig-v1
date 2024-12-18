import React from 'react';
import { Button } from "@/components/ui/button";
import { MoreVertical, Download, Trash2, Wand2, Info } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import LikeButton from './LikeButton';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

const ImageCardActions = ({ 
  image, 
  isMobile, 
  isLiked, 
  likeCount = 0, 
  onToggleLike = () => {},
  onViewDetails = () => {},
  onDownload = () => {},
  onDiscard = () => {},
  userId,
  isHovered
}) => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();
  const isMobileDevice = useMediaQuery('(max-width: 768px)');

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onViewDetails(image);
  };

  const handleDiscard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!image?.id) return;
    onDiscard(image);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDownload(image);
  };

  const handleRemixClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }
    const hash = isMobileDevice ? '#imagegenerate' : '#myimages';
    navigate(`/?remix=${image.id}${hash}`, { replace: true });
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-2 transition-opacity duration-200",
        !isHovered && !isMobileDevice && "opacity-60"
      )} 
      onClick={e => e.stopPropagation()}
    >
      {session && (
        <div className="flex items-center gap-1.5">
          <LikeButton isLiked={isLiked} onToggle={() => onToggleLike(image.id)} />
          <span className="text-xs text-muted-foreground/80 font-medium">{likeCount}</span>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "h-7 w-7 p-0 transition-all duration-200",
              "hover:bg-accent/40 hover:text-accent-foreground",
              "focus-visible:ring-1 focus-visible:ring-ring"
            )}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="w-52 p-1.5 animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenuItem 
            onClick={handleDownload}
            className="flex items-center gap-2.5 py-2 px-3 cursor-pointer rounded-md group"
          >
            <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="font-medium">Download</span>
          </DropdownMenuItem>

          {session && (
            <>
              <DropdownMenuSeparator className="my-1.5 bg-border/30" />
              {image.user_id === userId && (
                <DropdownMenuItem 
                  onClick={handleDiscard}
                  className="flex items-center gap-2.5 py-2 px-3 cursor-pointer rounded-md group text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 group-hover:text-destructive transition-colors" />
                  <span className="font-medium">Discard</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={handleRemixClick}
                className="flex items-center gap-2.5 py-2 px-3 cursor-pointer rounded-md group"
              >
                <Wand2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="font-medium">Remix</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="my-1.5 bg-border/30" />
          <DropdownMenuItem 
            onClick={handleViewDetails}
            className="flex items-center gap-2.5 py-2 px-3 cursor-pointer rounded-md group"
          >
            <Info className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="font-medium">View Details</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImageCardActions;