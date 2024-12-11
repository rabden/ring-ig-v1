import React, { useState, useEffect } from 'react'
import { Loader, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { cn } from "@/lib/utils"

const GeneratingImagesDropdown = ({ generatingImages = [], onCancel }) => {
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
        {generatingImages.map((img, index) => (
          <DropdownMenuItem key={index} className="justify-between">
            <span className="truncate flex-1">
              {modelConfigs?.[img.model]?.name || img.model}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCancel(img.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GeneratingImagesDropdown;