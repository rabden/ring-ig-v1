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
      onOpenChange(false);
    }
  }, [generatingImages.length, onOpenChange]);

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
                  "flex flex-col gap-3 p-4 rounded-xl transition-all duration-300",
                  "border border-border/80 backdrop-blur-[2px]",
                  image.status === 'completed' 
                    ? "bg-muted/5 hover:bg-muted/10" 
                    : image.status === 'processing'
                    ? "bg-primary/5 hover:bg-primary/10"
                    : "bg-muted/10 hover:bg-muted/20",
                  "group"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className={cn(
                    "font-medium text-sm transition-colors duration-200",
                    image.status === 'completed' 
                      ? "text-foreground/70" 
                      : image.status === 'processing'
                      ? "text-primary/90"
                      : "text-muted-foreground"
                  )}>
                    {image.status === 'completed' ? 'Complete' : 
                     image.status === 'processing' ? 'Generating...' : 'Queued'}
                  </span>
                  {image.width && image.height && (
                    <Badge 
                      variant={image.status === 'completed' ? "secondary" : "outline"} 
                      className={cn(
                        "ml-auto transition-colors duration-200",
                        image.status === 'completed' 
                          ? "bg-muted/20 hover:bg-muted/30 text-foreground/70" 
                          : image.status === 'processing'
                          ? "border-primary/20 bg-primary/10 text-primary/90"
                          : "border-muted-foreground/20 bg-muted/10 text-muted-foreground/70"
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
                  ) : image.status === 'processing' ? (
                    <div className="ml-auto p-1 rounded-lg ">
                      <Loader className="h-3.5 w-3.5 animate-spin text-primary/90" />
                    </div>
                  ) : (
                    <div className="ml-auto p-1 rounded-lg ">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
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