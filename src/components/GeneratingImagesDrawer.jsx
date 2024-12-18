import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Loader } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isValid } from 'date-fns';
import { Badge } from "@/components/ui/badge"
import { useModelConfigs } from '@/hooks/useModelConfigs'

const GeneratingImagesDrawer = ({ open, onOpenChange, generatingImages = [] }) => {
  const { data: modelConfigs } = useModelConfigs();
  const [showDrawer, setShowDrawer] = useState(false);
  const [completedImages, setCompletedImages] = useState(new Set());

  useEffect(() => {
    if (generatingImages.length > 0) {
      setShowDrawer(true);
    }

    generatingImages.forEach(image => {
      if (image.status === 'completed' && !completedImages.has(image.id)) {
        setCompletedImages(prev => new Set([...prev, image.id]));
      }
    });

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
  const allCompleted = generatingImages.length > 0 && generatingImages.every(img => img.status === 'completed');

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="focus:outline-none max-w-[400px] mx-auto">
        <DrawerHeader className="border-b border-border/10 px-6 py-4">
          <DrawerTitle className="flex items-center gap-3 text-base font-medium">
            {pendingCount > 0 ? (
              <div className="flex items-center gap-3">
                <Loader className="h-4 w-4 animate-spin text-primary" />
                <span>Generating {pendingCount} image{pendingCount > 1 ? 's' : ''}...</span>
              </div>
            ) : allCompleted ? (
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary" />
                <span>Complete</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Loader className="h-4 w-4 animate-spin text-primary" />
                <span>Processing...</span>
              </div>
            )}
          </DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="flex-1 h-[70vh]">
          <div className="px-6 py-4 space-y-3">
            {generatingImages.map((image) => (
              <div
                key={image.id}
                className={cn(
                  "flex flex-col gap-2 p-4 rounded-lg transition-all duration-200",
                  image.status === 'completed' 
                    ? "bg-muted/30 border border-border/10" 
                    : "bg-primary/5 border border-primary/10"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className={cn(
                    "font-medium text-sm",
                    image.status === 'completed' ? "text-muted-foreground" : "text-primary"
                  )}>
                    {image.status === 'completed' ? 'Complete' : 'Generating...'}
                  </span>
                  {image.width && image.height && (
                    <Badge 
                      variant={image.status === 'completed' ? "secondary" : "outline"} 
                      className="ml-auto"
                    >
                      {image.width}x{image.height}
                    </Badge>
                  )}
                </div>
                {image.prompt && (
                  <span className="text-sm text-muted-foreground/80 line-clamp-2">
                    {image.prompt}
                  </span>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                  <span>{modelConfigs?.[image.model]?.name || image.model}</span>
                  {image.status === 'completed' ? (
                    <Check className="h-3.5 w-3.5 ml-auto text-primary" />
                  ) : (
                    <div className="ml-auto p-0.5 rounded-full bg-primary/10">
                      <Loader className="h-3 w-3 animate-spin text-primary" />
                    </div>
                  )}
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