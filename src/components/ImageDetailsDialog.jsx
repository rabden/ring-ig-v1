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

const ImageDetailsDialog = ({ open, onOpenChange, image }) => {
  const { data: modelConfigs } = useModelConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  
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
      <DialogContent className={cn(
        "sm:max-w-[425px] max-h-[80vh] overflow-hidden",
        "bg-background/80 backdrop-blur-sm",
        "border-none shadow-lg",
        "animate-in fade-in-0 zoom-in-95"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "text-xl font-semibold tracking-tight",
            "bg-gradient-to-br from-foreground to-foreground/70",
            "bg-clip-text text-transparent"
          )}>
            Image Details
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[calc(80vh-100px)]">
          <div className="space-y-8 px-1">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Prompt
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-8 w-8 transition-all duration-200",
                      "hover:bg-accent/40 hover:text-accent-foreground",
                      "group"
                    )} 
                    onClick={handleCopyPrompt}
                  >
                    {copyIcon === 'copy' ? (
                      <Copy className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    ) : (
                      <Check className="h-4 w-4 text-primary animate-in zoom-in duration-300" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-8 w-8 transition-all duration-200",
                      "hover:bg-accent/40 hover:text-accent-foreground",
                      "group"
                    )} 
                    onClick={handleShare}
                  >
                    {shareIcon === 'share' ? (
                      <Share2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    ) : (
                      <Check className="h-4 w-4 text-primary animate-in zoom-in duration-300" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground/90">{image.prompt}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {detailItems.map((item, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "space-y-1.5 p-2 rounded-lg",
                    "transition-colors duration-200",
                    "hover:bg-muted/40 group"
                  )}
                >
                  <p className={cn(
                    "text-xs text-muted-foreground/70 uppercase tracking-wider",
                    "transition-colors duration-200",
                    "group-hover:text-muted-foreground"
                  )}>
                    {item.label}
                  </p>
                  <p className={cn(
                    "text-sm font-medium text-foreground/90",
                    "transition-colors duration-200",
                    "group-hover:text-foreground"
                  )}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsDialog;