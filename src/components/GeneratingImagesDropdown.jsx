import React from 'react'
import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useStyleConfigs } from '@/hooks/useStyleConfigs'

const GeneratingImagesDropdown = ({ generatingImages = [] }) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  
  if (!generatingImages?.length) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          Generating-{generatingImages.length}
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
              {img.style && modelConfigs?.[img.model]?.category !== "NSFW" && (
                <>
                  <span>•</span>
                  <span>{styleConfigs?.[img.style]?.name || img.style}</span>
                </>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GeneratingImagesDropdown;