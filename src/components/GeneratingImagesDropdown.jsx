import React, { useState, useEffect } from 'react'
import { Loader, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { cn } from "@/lib/utils"

const GeneratingImagesDropdown = ({ generatingImages = [] }) => {
  const { data: modelConfigs } = useModelConfigs();
  const [showDropdown, setShowDropdown] = useState(false);
  const [completedImages, setCompletedImages] = useState(new Set());
  
  useEffect(() => {
    if (generatingImages.length > 0) {
      setShowDropdown(true);
    } else {
      const timer = setTimeout(() => {
        setShowDropdown(false);
        setCompletedImages(new Set());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [generatingImages.length]);

  if (!showDropdown) return null;

  const pendingCount = generatingImages.filter(img => img.status === 'pending').length;
  const generatingCount = generatingImages.filter(img => img.status === 'generating').length;
  const completedCount = generatingImages.filter(img => img.status === 'completed').length;
  const totalCount = generatingImages.length;

  const getStatusDisplay = () => {
    if (generatingCount > 0) {
      return (
        <>
          <div className="p-1 rounded-lg bg-primary/10 backdrop-blur-[1px] mr-2">
            <Loader className="w-4 h-4 animate-spin text-primary/90" />
          </div>
          <span className="text-sm">Generating {pendingCount > 0 ? `(${pendingCount} queued)` : ''}</span>
        </>
      );
    } else if (pendingCount > 0) {
      return (
        <>
          <div className="p-1 rounded-lg bg-muted/10 backdrop-blur-[1px] mr-2">
            <Loader className="w-4 h-4 text-muted-foreground/50" />
          </div>
          <span className="text-sm">{pendingCount} in queue</span>
        </>
      );
    } else if (completedCount === totalCount) {
      return (
        <>
          <div className="p-1 rounded-lg bg-primary/10 backdrop-blur-[1px] mr-2">
            <Check className="w-4 h-4 text-primary/90" />
          </div>
          <span className="text-sm">Complete</span>
        </>
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-8 rounded-xl bg-background/50 hover:bg-accent/10",
            "transition-all duration-200",
            completedCount === totalCount && "text-primary"
          )}
        >
          {getStatusDisplay()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[300px] p-2 border-border/80 bg-card/95 backdrop-blur-[2px] shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
      >
        {generatingImages.map((img) => (
          <DropdownMenuItem 
            key={img.id} 
            className={cn(
              "flex flex-col items-start gap-2 p-3 rounded-lg",
              "transition-all duration-200",
              "hover:bg-accent/10 focus:bg-accent/10",
              "group"
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-1 rounded-lg backdrop-blur-[1px]",
                  img.status === 'completed' 
                    ? "bg-primary/10" 
                    : img.status === 'generating'
                    ? "bg-primary/10"
                    : "bg-muted/10"
                )}>
                  {img.status === 'completed' ? (
                    <Check className="w-3.5 h-3.5 text-primary/90" />
                  ) : img.status === 'generating' ? (
                    <Loader className="w-3.5 h-3.5 animate-spin text-primary/90" />
                  ) : (
                    <Loader className="w-3.5 h-3.5 text-muted-foreground/50" />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  img.status === 'completed' 
                    ? "text-foreground/70" 
                    : img.status === 'generating'
                    ? "text-primary/90"
                    : "text-muted-foreground"
                )}>
                  {img.status === 'completed' 
                    ? 'Complete' 
                    : img.status === 'generating'
                    ? 'Generating...'
                    : 'Queued'}
                </span>
              </div>
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-auto",
                  img.status === 'completed'
                    ? "bg-muted/20 hover:bg-muted/30 text-foreground/70"
                    : img.status === 'generating'
                    ? "border-primary/20 bg-primary/10 text-primary/90"
                    : "bg-muted/10 text-muted-foreground/70"
                )}
              >
                {img.width}x{img.height}
              </Badge>
            </div>
            {img.prompt && (
              <span className="text-xs text-muted-foreground/60 truncate w-full group-hover:text-muted-foreground/70 transition-colors duration-200">
                {img.prompt.length > 50 ? `${img.prompt.substring(0, 50)}...` : img.prompt}
              </span>
            )}
            <div className="flex gap-2 text-xs text-muted-foreground/50 group-hover:text-muted-foreground/60 transition-colors duration-200">
              <span>{modelConfigs?.[img.model]?.name || img.model}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GeneratingImagesDropdown;