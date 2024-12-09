import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { Loader, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const GeneratingImagesDrawer = ({ open, onOpenChange, generatingImages = [] }) => {
  const { data: modelConfigs } = useModelConfigs();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [prevLength, setPrevLength] = useState(generatingImages.length);

  // Handle showing checkmark when an image completes and drawer visibility
  useEffect(() => {
    if (generatingImages.length > 0) {
      setShowDrawer(true);
    }
    
    if (generatingImages.length < prevLength && prevLength > 0) {
      // Show checkmark for 1.5s when an image completes
      setShowCheckmark(true);
      const checkmarkTimer = setTimeout(() => {
        setShowCheckmark(false);
      }, 1500);

      // If no more images, keep showing checkmark and start 4s countdown to hide
      if (generatingImages.length === 0) {
        setShowCheckmark(true);
        const hideTimer = setTimeout(() => {
          setShowDrawer(false);
        }, 4000);
        return () => {
          clearTimeout(checkmarkTimer);
          clearTimeout(hideTimer);
        };
      }
      return () => clearTimeout(checkmarkTimer);
    }
    setPrevLength(generatingImages.length);
  }, [generatingImages.length, prevLength]);

  if (!showDrawer) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] bg-background">
        <div className="mx-auto w-12 h-1 flex-shrink-0 rounded-full bg-muted mt-4 mb-2" />
        <DrawerHeader className="border-b border-border/30 pb-4 pt-0">
          <div className="flex items-center gap-2">
            <DrawerTitle>
              Generating Images
            </DrawerTitle>
            <span className={cn(
              "h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center",
              showCheckmark && "animate-in zoom-in duration-300"
            )}>
              {showCheckmark ? (
                <Check className="h-3 w-3" />
              ) : (
                generatingImages.length > 9 ? '9+' : generatingImages.length
              )}
            </span>
          </div>
        </DrawerHeader>
        <ScrollArea className="h-[calc(90vh-100px)] px-4 py-4 space-y-4">
          {generatingImages.map((img) => (
            <div 
              key={img.id} 
              className="flex flex-col gap-2 p-4 border border-border/30 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="font-medium">Generating...</span>
                <Badge variant="secondary" className="ml-auto">
                  {img.width}x{img.height}
                </Badge>
              </div>
              {img.prompt && (
                <p className="text-sm text-muted-foreground">
                  {img.prompt.length > 100 
                    ? `${img.prompt.substring(0, 100)}...` 
                    : img.prompt}
                </p>
              )}
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{modelConfigs?.[img.model]?.name || img.model}</span>
              </div>
            </div>
          ))}
          {generatingImages.length === 0 && (
            <div className="flex items-center justify-center gap-2 p-4">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">
                Generation Complete
              </span>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default GeneratingImagesDrawer;