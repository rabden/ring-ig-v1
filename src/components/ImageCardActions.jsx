import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, Trash2, RefreshCw } from "lucide-react";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageRemix } from '@/hooks/useImageRemix';
import { useNavigate } from 'react-router-dom';

const ImageCardActions = ({
  image,
  onDownload,
  onDiscard,
  isOwner,
  setStyle,
  setActiveTab,
  onRemix = () => {},
  size = "default"
}) => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();
  const { handleRemix } = useImageRemix(session, () => {
    navigate(`/?remix=${image.id}`);
  }, () => {});

  const handleDiscardClick = (e) => {
    e.stopPropagation();
    if (onDiscard) {
      onDiscard(image);
    }
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(image);
    }
  };

  const handleRemixClick = (e) => {
    e.stopPropagation();
    handleRemix(image);
  };

  if (size === "sm") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDownloadClick}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
          {isOwner && (
            <DropdownMenuItem onClick={handleDiscardClick} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Discard
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleRemixClick}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span className="font-medium">Remix</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={handleDownloadClick}>
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      {isOwner && (
        <Button variant="ghost" size="sm" onClick={handleDiscardClick} className="text-destructive hover:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Discard
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={handleRemixClick}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Remix
      </Button>
    </div>
  );
};

export default ImageCardActions;