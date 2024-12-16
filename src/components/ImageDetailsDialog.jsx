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
        "border border-border/20 bg-background/95",
        "backdrop-blur-sm shadow-[0_0_0_1px] shadow-border/10"
      )}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground/90">
            Image Details
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-6 max-h-[calc(80vh-100px)]">
          <div className="space-y-8 px-1">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-muted-foreground/70 uppercase tracking-wider">
                  Prompt
                </h3>
                <div className="flex gap-1.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      "text-muted-foreground/60 hover:text-foreground/80",
                      "hover:bg-accent/10"
                    )} 
                    onClick={handleCopyPrompt}
                  >
                    {copyIcon === 'copy' ? (
                      <Copy className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      "text-muted-foreground/60 hover:text-foreground/80",
                      "hover:bg-accent/10"
                    )} 
                    onClick={handleShare}
                  >
                    {shareIcon === 'share' ? (
                      <Share2 className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </div>
              </div>
              <div className={cn(
                "p-3 rounded-lg text-sm text-foreground/80",
                "bg-accent/5 border border-border/10"
              )}>
                {image.prompt}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {detailItems.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-foreground/80">
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