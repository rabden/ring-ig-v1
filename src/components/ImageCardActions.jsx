import React from 'react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download, Trash2, Sparkles } from "lucide-react";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageRemix } from '@/hooks/useImageRemix';

const ImageCardActions = ({
  image,
  onDownload = () => {},
  onDiscard = () => {},
  isOwner = false
}) => {
  const { session } = useSupabaseAuth();
  const { handleRemix } = useImageRemix(session);

  const handleDownloadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDownload(image);
  };

  const handleDiscardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDiscard(image);
  };

  const handleRemixClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleRemix(image);
  };

  return (
    <>
      <DropdownMenuItem onClick={handleDownloadClick}>
        <Download className="mr-2 h-4 w-4" />
        <span className="font-medium">Download</span>
      </DropdownMenuItem>
      {isOwner && (
        <DropdownMenuItem onClick={handleDiscardClick} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span className="font-medium">Discard</span>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={handleRemixClick}>
        <Sparkles className="mr-2 h-4 w-4" />
        <span className="font-medium">Remix</span>
      </DropdownMenuItem>
    </>
  );
};

export default ImageCardActions;