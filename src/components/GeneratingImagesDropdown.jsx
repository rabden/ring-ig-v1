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
  const [prevLength, setPrevLength] = useState(generatingImages.length);
  
  // Handle showing checkmark when an image completes
  useEffect(() => {
    if (generatingImages.length < prevLength) {
      // Show checkmark for 1.5s when an image completes
      setCompletedImages(new Set(['temp'])); // Use a temp value since we don't track specific images
      setTimeout(() => {
        setCompletedImages(new Set());
      }, 1500);
    }
    setPrevLength(generatingImages.length);
  }, [generatingImages.length]);

  // Handle 4s delay before hiding dropdown
  useEffect(() => {
    if (generatingImages.length > 0) {
      setShowDropdown(true);
    } else {
      // Wait 4s before hiding
      const timer = setTimeout(() => {
        setShowDropdown(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [generatingImages.length]);

  if (!showDropdown) return null;
  
  const showCheckmark = completedImages.size > 0 || (generatingImages.length === 0 && showDropdown);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-8 rounded-xl bg-background/50 hover:bg-accent/10",
            "transition-all duration-200",
            showCheckmark && "text-primary"
          )}
        >
          {showCheckmark ? (
            <div className={cn(
              "p-1 rounded-lg bg-primary/10 backdrop-blur-[1px] mr-2",
              completedImages.size > 0 && "animate-in zoom-in duration-300"
            )}>
              <Check className="w-4 h-4 text-primary/90" />
            </div>
          ) : (
            <div className="p-1 rounded-lg bg-primary/10 backdrop-blur-[1px] mr-2">
              <Loader className="w-4 h-4 animate-spin text-primary/90" />
            </div>
          )}
          <span className="text-sm">
            {generatingImages.length > 0 ? `Generating-${generatingImages.length}` : 'Complete'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[300px] p-2 border-border/10 bg-card/95 backdrop-blur-[2px] shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
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
                <div className="p-1 rounded-lg bg-primary/10 backdrop-blur-[1px]">
                  <Loader className="w-3.5 h-3.5 animate-spin text-primary/90" />
                </div>
                <span className="text-sm font-medium text-primary/90">Generating...</span>
              </div>
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-auto bg-muted/20 hover:bg-muted/30 text-foreground/70",
                  "transition-colors duration-200"
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