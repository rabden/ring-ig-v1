import React from 'react';
import { Button } from "@/components/ui/button";
import { MoreVertical, Download, Trash2, Wand2, Info } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import LikeButton from './LikeButton';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from "@/lib/utils";

const ImageCardActions = ({ 
  image, 
  isMobile, 
  isLiked, 
  likeCount = 0, 
  onToggleLike = () => {},
  onViewDetails = () => {},
  onDownload = () => {},
  onDiscard = () => {},
  userId
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
    <div className="flex items-center gap-1 px-1" onClick={e => e.stopPropagation()}>
      {session && (
        <div className="flex items-center gap-2">
          <LikeButton isLiked={isLiked} onToggle={() => onToggleLike(image.id)} />
          <span className={cn(
            "text-xs text-muted-foreground/60 group-hover:text-muted-foreground/80",
            "transition-colors duration-200"
          )}>
            {likeCount}
          </span>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "h-7 w-7 p-0 rounded-lg",
              "bg-muted/5 hover:bg-muted/10",
              "transition-all duration-200"
            )}
          >
            <MoreVertical className="h-4 w-4 text-foreground/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className={cn(
            "w-52 p-2 m-2",
            "border-border/80 bg-card",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          <DropdownMenuItem 
            onClick={handleDownload}
            className={cn(
              "flex items-center gap-3 py-2 px-3 rounded-lg",
              "cursor-pointer transition-colors duration-200",
              "hover:bg-accent/10 focus:bg-accent/10",
              "group"
            )}
          >
            <Download className="h-4 w-4 text-muted-foreground/70 group-hover:text-foreground/90 transition-colors duration-200" />
            <span className="text-sm font-medium text-foreground/90">Download</span>
          </DropdownMenuItem>

          {session && (
            <>
              <DropdownMenuSeparator className="my-2 bg-border/5" />
              {image.user_id === userId && (
                <DropdownMenuItem 
                  onClick={handleDiscard}
                  className={cn(
                    "flex items-center gap-3 py-2 px-3 rounded-lg mb-2",
                    "cursor-pointer transition-colors duration-200",
                    "hover:bg-destructive/50 focus:bg-destructive/10",
                    "text-destructive/90 hover:text-destructive",
                    "group"
                  )}
                >
                  <Trash2 className="h-4 w-4 transition-colors duration-200" />
                  <span className="text-sm font-medium">Discard</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={handleRemixClick}
                className={cn(
                  "flex items-center gap-3 py-2 px-3 rounded-lg",
                  "cursor-pointer transition-colors duration-200",
                  "hover:bg-accent/10 focus:bg-accent/10",
                  "group"
                )}
              >
                <Wand2 className="h-4 w-4 text-muted-foreground/70 group-hover:text-foreground/90 transition-colors duration-200" />
                <span className="text-sm font-medium text-foreground/90">Remix</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="my-2 bg-border/5" />
          <DropdownMenuItem 
            onClick={handleViewDetails}
            className={cn(
              "flex items-center gap-3 py-2 px-3 rounded-lg",
              "cursor-pointer transition-colors duration-200",
              "hover:bg-accent/10 focus:bg-accent/10",
              "group"
            )}
          >
            <Info className="h-4 w-4 text-muted-foreground/70 group-hover:text-foreground/90 transition-colors duration-200" />
            <span className="text-sm font-medium text-foreground/90">View Details</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImageCardActions;