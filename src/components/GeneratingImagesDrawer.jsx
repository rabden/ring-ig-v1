import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Loader, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isValid } from 'date-fns';
import { Badge } from "@/components/ui/badge"
import { useModelConfigs } from '@/hooks/useModelConfigs'

const GeneratingImagesDrawer = ({ open, onOpenChange, generatingImages = [] }) => {
  const { data: modelConfigs } = useModelConfigs();
  const [showDrawer, setShowDrawer] = useState(false);

  // Show drawer whenever there are any images (generating or completed)
  useEffect(() => {
    if (generatingImages.length > 0) {
      setShowDrawer(true);
    } else {
      setShowDrawer(false);
    }
  }, [generatingImages.length]);

  useEffect(() => {
    if (!showDrawer) {
      onOpenChange(false);
    }
  }, [showDrawer, onOpenChange]);

  if (!showDrawer) return null;

  const processingCount = generatingImages.filter(img => img.status === 'processing').length;
  const pendingCount = generatingImages.filter(img => img.status === 'pending').length;
  const completedCount = generatingImages.filter(img => img.status === 'completed').length;
  const isAllCompleted = generatingImages.length > 0 && generatingImages.every(img => img.status === 'completed');

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="focus:outline-none max-w-[350px] mx-auto">
        <DrawerHeader className="border-b border-border/5 p-4">
          <DrawerTitle className="flex items-center gap-3 text-base font-medium text-foreground/90">
            {processingCount > 0 ? (
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-lg ">
                  <Loader className="h-4 w-4 animate-spin text-primary/90" />
                </div>
                <span>Generating {processingCount} image{processingCount > 1 ? 's' : ''}...</span>
              </div>
            ) : pendingCount > 0 ? (
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-lg ">
                  <Clock className="h-4 w-4 text-muted-foreground/70" />
                </div>
                <span>Queued {pendingCount} image{pendingCount > 1 ? 's' : ''}</span>
              </div>
            ) : completedCount > 0 ? (
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-lg ">
                  <Check className="h-4 w-4 text-primary/90" />
                </div>
                <span>Generated {completedCount} image{completedCount > 1 ? 's' : ''}</span>
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
                  "flex flex-col items-start gap-2 p-3 rounded-lg",
                  "transition-all duration-200",
                  "hover:bg-accent/10 focus:bg-accent/10",
                  "group"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg ">
                      {image.status === 'processing' ? (
                        <Loader className="w-3.5 h-3.5 animate-spin text-primary/90" />
                      ) : image.status === 'pending' ? (
                        <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-primary/90" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-primary/90">
                      {image.status === 'processing' ? 'Generating...' : 
                       image.status === 'pending' ? 'Queued' : 'Complete'}
                    </span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-auto bg-muted/20 hover:bg-muted/30 text-foreground/70",
                      "transition-colors duration-200"
                    )}
                  >
                    {image.width}x{image.height}
                  </Badge>
                </div>
                {image.prompt && (
                  <span className="text-xs text-muted-foreground/60 truncate w-full group-hover:text-muted-foreground/70 transition-colors duration-200">
                    {image.prompt.length > 50 ? `${image.prompt.substring(0, 50)}...` : image.prompt}
                  </span>
                )}
                <div className="flex gap-2 text-xs text-muted-foreground/50 group-hover:text-muted-foreground/60 transition-colors duration-200">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground/70">
                        {modelConfigs?.[image.model]?.name || image.model}
                      </p>
                      <span className="text-xs text-muted-foreground/50">•</span>
                      <p className="text-xs text-muted-foreground/70">
                        {image.quality}
                      </p>
                      <span className="text-xs text-muted-foreground/50">•</span>
                      <p className="text-xs text-muted-foreground/70 capitalize">
                        {image.generation_mode || 'fast'}
                      </p>
                    </div>
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