import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Check, X } from "lucide-react"
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { format } from 'date-fns'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const ImageDetailsDialog = ({ open, onOpenChange, image, fromMenu = false }) => {
  const { data: modelConfigs } = useModelConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (!image) return null;

  const detailItems = [
    { label: "Model", value: modelConfigs?.[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Quality", value: image.quality },
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
      <DialogContent className={`${isMobile ? 'w-full h-full max-w-none' : 'sm:max-w-[800px]'} max-h-[90vh] overflow-hidden p-0`}>
        <div className="flex h-full">
          {/* Image Preview */}
          <div className={`${isMobile ? 'hidden' : 'w-1/2'} bg-black flex items-center justify-center`}>
            <img
              src={image.url}
              alt={image.prompt}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details Section */}
          <div className={`${isMobile ? 'w-full' : 'w-1/2'} flex flex-col h-full bg-background`}>
            <DialogHeader className="p-4 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">Image Details</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Mobile Image Preview */}
                {isMobile && (
                  <div className="aspect-square w-full mb-4 bg-black/5 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Prompt</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyPrompt}>
                        {copyIcon === 'copy' ? <Copy className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                        {shareIcon === 'share' ? <Share2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{image.prompt}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {detailItems.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsDialog;