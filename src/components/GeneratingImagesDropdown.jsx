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
        <Button variant="outline" size="sm" className="h-8">
          {showCheckmark ? (
            <Check className={cn(
              "w-4 h-4 mr-2",
              completedImages.size > 0 && "animate-in zoom-in duration-300"
            )} />
          ) : (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          )}
          {generatingImages.length > 0 ? `Generating-${generatingImages.length}` : 'Complete'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        {generatingImages.map((img) => (
          <DropdownMenuItem key={img.id} className="flex flex-col items-start gap-1 py-2">
            <div className="flex items-center gap-2 w-full">
              <span className="font-medium">Generating...</span>
              <Badge variant="secondary" className="ml-auto">
                {img.width}x{img.height}
              </Badge>
            </div>
            {img.prompt && (
              <span className="text-xs text-muted-foreground truncate w-full">
                {img.prompt.length > 50 ? `${img.prompt.substring(0, 50)}...` : img.prompt}
              </span>
            )}
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{modelConfigs?.[img.model]?.name || img.model}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GeneratingImagesDropdown;