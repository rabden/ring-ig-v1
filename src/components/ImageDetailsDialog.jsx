import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Check } from "lucide-react"
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import TruncatablePrompt from './TruncatablePrompt'
import ImageDetailsSection from './image-view/ImageDetailsSection'
import ImagePromptSection from './image-view/ImagePromptSection'

const ImageDetailsDialog = ({ open, onOpenChange, image }) => {
  const { data: modelConfigs } = useModelConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  
  if (!image) return null;

  const detailItems = [
    { label: "Model", value: modelConfigs?.[image.model]?.name || image.model },
    { label: "Generation Mode", value: image.generation_mode || 'fast' },
    { label: "Quality", value: image.quality },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio || "1:1" },
    { label: "Seed", value: image.seed },
    { label: "Created", value: format(new Date(image.created_at), 'MMM d, yyyy h:mm a') }
  ];

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(image.prompt);
    setCopyIcon('check');
    setTimeout(() => setCopyIcon('copy'), 1500);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/image/${image.id}`);
    setShareIcon('check');
    setTimeout(() => setShareIcon('share'), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[500px] max-h-[80vh] overflow-hidden",
        "border-border/80 bg-card/95",
        "p-4 rounded-xl"
      )}>
        <DialogHeader className="px-3">
          <DialogTitle className="text-md font-medium text-muted-foreground/70 uppercase tracking-wider">Image Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-3 max-h-[calc(80vh-80px)]">
          <div className="space-y-4 px-1">
            <ImagePromptSection 
              prompt={image.prompt}
              negative_prompt={image.negative_prompt}
              copyIcon={copyIcon}
              shareIcon={shareIcon}
              onCopyPrompt={handleCopyPrompt}
              onShare={handleShare}
            />

            <ImageDetailsSection detailItems={detailItems} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsDialog;