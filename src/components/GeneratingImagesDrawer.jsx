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
      <DrawerContent className="focus:outline-none max-w-[350px] mx-auto">
        <DrawerHeader className="border-b border-border/5 p-4">
          <DrawerTitle className="flex items-center gap-3 text-base font-medium text-foreground/90">
            {pendingCount > 0 ? (
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-lg ">
                  <Loader className="h-4 w-4 animate-spin text-primary/90" />
                </div>
                <span>Generating {pendingCount} image{pendingCount > 1 ? 's' : ''}...</span>
              </div>
            ) : allCompleted ? (
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-lg ">
                  <Check className="h-4 w-4 text-primary/90" />
                </div>
                <span>Complete</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-lg ">
                  <Loader className="h-4 w-4 animate-spin text-primary/90" />
                </div>
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
                  "flex flex-col gap-3 p-4 rounded-xl transition-all duration-300",
                  "border border-border/80 backdrop-blur-[2px]",
                  image.status === 'completed' 
                    ? "bg-muted/5 hover:bg-muted/10" 
                    : "bg-primary/5 hover:bg-primary/10",
                  "group"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className={cn(
                    "font-medium text-sm transition-colors duration-200",
                    image.status === 'completed' ? "text-foreground/70" : "text-primary/90"
                  )}>
                    {image.status === 'completed' ? 'Complete' : 'Generating...'}
                  </span>
                  {image.width && image.height && (
                    <Badge 
                      variant={image.status === 'completed' ? "secondary" : "outline"} 
                      className={cn(
                        "ml-auto transition-colors duration-200",
                        image.status === 'completed' 
                          ? "bg-muted/20 hover:bg-muted/30 text-foreground/70" 
                          : "border-primary/20 bg-primary/10 text-primary/90"
                      )}
                    >
                      {image.width}x{image.height}
                    </Badge>
                  )}
                </div>
                {image.prompt && (
                  <span className="text-sm text-muted-foreground/60 line-clamp-2 group-hover:text-muted-foreground/70 transition-colors duration-200">
                    {image.prompt}
                  </span>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground/50 group-hover:text-muted-foreground/60 transition-colors duration-200">
                  <span>{modelConfigs?.[image.model]?.name || image.model}</span>
                  {image.status === 'completed' ? (
                    <div className="ml-auto p-1 rounded-lg ">
                      <Check className="h-3.5 w-3.5 text-primary/90" />
                    </div>
                  ) : (
                    <div className="ml-auto p-1 rounded-lg ">
                      <Loader className="h-3.5 w-3.5 animate-spin text-primary/90" />
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