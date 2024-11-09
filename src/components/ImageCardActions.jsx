import React from 'react';
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LikeButton from './LikeButton';
import { useImageRemix } from '@/hooks/useImageRemix';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const ImageCardActions = ({ 
  image, 
  onDiscard, 
  onDownload, 
  onViewDetails, 
  isOwner,
  setStyle,
  setActiveTab 
}) => {
  const { session } = useSupabaseAuth();
  const { handleRemix } = useImageRemix(session, null, setStyle, setActiveTab);

  const handleDownloadClick = () => {
    if (!session) return;
    onDownload();
  };

  const handleRemixClick = () => {
    if (!session) return;
    handleRemix(image);
  };

  const handleDiscard = () => {
    if (!image?.id) return;
    onDiscard(image);
  };

  return (
    <div className="flex items-center gap-2">
      <LikeButton imageId={image.id} />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-accent rounded-full">
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {session && (
            <>
              <DropdownMenuItem onClick={handleDownloadClick}>
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRemixClick}>
                Remix
              </DropdownMenuItem>
              {isOwner && (
                <DropdownMenuItem 
                  onClick={handleDiscard}
                  className="text-destructive"
                >
                  Discard
                </DropdownMenuItem>
              )}
            </>
          )}
          <DropdownMenuItem onClick={onViewDetails}>
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImageCardActions;