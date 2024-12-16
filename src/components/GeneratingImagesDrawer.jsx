import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from 'date-fns';

const GeneratingImagesDrawer = ({ open, onOpenChange, generatingImages = [] }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [completedImages, setCompletedImages] = useState(new Set());

  // Handle showing checkmark when an image completes and drawer visibility
  useEffect(() => {
    if (generatingImages.length > 0) {
      setShowDrawer(true);
    }

    generatingImages.forEach(image => {
      if (image.status === 'completed' && !completedImages.has(image.id)) {
        setCompletedImages(prev => new Set([...prev, image.id]));
      }
    });

    // Hide drawer after all images are completed and a delay
    const allCompleted = generatingImages.every(img => img.status === 'completed');
    if (allCompleted && generatingImages.length > 0) {
      const timer = setTimeout(() => {
        setShowDrawer(false);
        onOpenChange(false);
        setCompletedImages(new Set());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [generatingImages, completedImages, onOpenChange]);

  if (!showDrawer) return null;

  const pendingCount = generatingImages.filter(img => img.status === 'pending').length;
  const completedCount = generatingImages.filter(img => img.status === 'completed').length;
  const totalCount = generatingImages.length;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="focus:outline-none">
        <DrawerHeader className="border-b border-border/30 px-4 pb-4">
          <DrawerTitle className="text-lg font-semibold flex items-center gap-3">
            Generating Images
            {pendingCount > 0 && (
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
              </div>
            )}
          </DrawerTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {pendingCount > 0 
              ? `Generating ${pendingCount} image${pendingCount > 1 ? 's' : ''}...`
              : `Generated ${totalCount} image${totalCount > 1 ? 's' : ''}`
            }
          </p>
        </DrawerHeader>

        <ScrollArea className="flex-1 h-[65vh]">
          <div className="px-4 py-6 space-y-3">
            {generatingImages.map((image, index) => (
              <div
                key={image.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border border-border/50 transition-all duration-200",
                  image.status === 'completed' ? "bg-muted/50" : "bg-card"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Image {index + 1}</span>
                    {image.status === 'completed' ? (
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {image.prompt}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{image.model}</span>
                    <span>•</span>
                    <span>{image.startTime ? format(new Date(image.startTime), 'HH:mm:ss') : '--:--:--'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default GeneratingImagesDrawer;