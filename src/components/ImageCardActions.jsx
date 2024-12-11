import React from 'react';
import { Button } from "@/components/ui/button";
import { MoreVertical, Download, Trash2, Wand2, Info } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import LikeButton from './LikeButton';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      {session && (
        <div className="flex items-center gap-1">
          <LikeButton isLiked={isLiked} onToggle={() => onToggleLike(image.id)} />
          <span className="text-xs text-muted-foreground">{likeCount}</span>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 p-0 hover:bg-background/80 transition-colors duration-200"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="w-48 p-1 animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenuItem 
            onClick={handleDownload}
            className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-accent rounded-sm group"
          >
            <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="font-medium">Download</span>
          </DropdownMenuItem>

          {session && (
            <>
              <DropdownMenuSeparator className="my-1" />
              {image.user_id === userId && (
                <DropdownMenuItem 
                  onClick={handleDiscard}
                  className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-accent rounded-sm group text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 group-hover:text-destructive transition-colors" />
                  <span className="font-medium">Discard</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={handleRemixClick}
                className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-accent rounded-sm group"
              >
                <Wand2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="font-medium">Remix</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem 
            onClick={handleViewDetails}
            className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-accent rounded-sm group"
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