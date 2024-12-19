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
    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
      {session && (
        <div className="flex items-center gap-2">
          <LikeButton isLiked={isLiked} onToggle={() => onToggleLike(image.id)} />
          <span className={cn(
            "text-xs font-medium",
            "text-muted-foreground/70 group-hover:text-muted-foreground/90",
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
              "h-8 w-8 p-0 rounded-lg",
              "bg-muted/10 hover:bg-muted/20",
              "ring-1 ring-border/10 hover:ring-border/20",
              "transition-all duration-200",
              "group"
            )}
          >
            <MoreVertical className="h-4 w-4 text-foreground/70 group-hover:text-foreground/90 transition-colors duration-200" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className={cn(
            "w-52 p-2",
            "border-2 border-border/20 bg-card/98",
            "backdrop-blur-[2px]",
            "shadow-lg shadow-primary/5",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          <DropdownMenuItem 
            onClick={handleDownload}
            className={cn(
              "flex items-center gap-3 py-2.5 px-3 rounded-lg",
              "cursor-pointer transition-all duration-200",
              "hover:bg-muted/20 focus:bg-muted/20",
              "ring-1 ring-border/10 hover:ring-border/20",
              "group"
            )}
          >
            <Download className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors duration-200" />
            <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors duration-200">
              Download
            </span>
          </DropdownMenuItem>

          {session && (
            <>
              <DropdownMenuSeparator className="my-2 bg-border/10" />
              {image.user_id === userId && (
                <DropdownMenuItem 
                  onClick={handleDiscard}
                  className={cn(
                    "flex items-center gap-3 py-2.5 px-3 rounded-lg",
                    "cursor-pointer transition-all duration-200",
                    "hover:bg-destructive/20 focus:bg-destructive/20",
                    "ring-1 ring-border/10 hover:ring-destructive/20",
                    "text-destructive hover:text-destructive",
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
                  "flex items-center gap-3 py-2.5 px-3 rounded-lg",
                  "cursor-pointer transition-all duration-200",
                  "hover:bg-muted/20 focus:bg-muted/20",
                  "ring-1 ring-border/10 hover:ring-border/20",
                  "group"
                )}
              >
                <Wand2 className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors duration-200" />
                <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors duration-200">
                  Remix
                </span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="my-2 bg-border/10" />
          <DropdownMenuItem 
            onClick={handleViewDetails}
            className={cn(
              "flex items-center gap-3 py-2.5 px-3 rounded-lg",
              "cursor-pointer transition-all duration-200",
              "hover:bg-muted/20 focus:bg-muted/20",
              "ring-1 ring-border/10 hover:ring-border/20",
              "group"
            )}
          >
            <Info className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors duration-200" />
            <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors duration-200">
              View Details
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImageCardActions;