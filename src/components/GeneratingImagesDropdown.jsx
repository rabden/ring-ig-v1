import React from 'react'
import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useStyleConfigs } from '@/hooks/useStyleConfigs'
import { supabase } from '@/integrations/supabase/supabase'
import { Skeleton } from "@/components/ui/skeleton"

const GeneratingImagesDropdown = ({ generatingImages = [], completedImages = [] }) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  
  const totalImages = [...generatingImages, ...completedImages];
  if (!totalImages?.length) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          {generatingImages.length > 0 ? `Generating-${generatingImages.length}` : 'Recent'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        {totalImages.map((img) => (
          <DropdownMenuItem key={img.id} className="flex flex-col items-start gap-1 py-2">
            <div className="flex items-center gap-2 w-full">
              <span className="font-medium">
                {generatingImages.includes(img) ? 'Generating...' : 'Generated'}
              </span>
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
            {!generatingImages.includes(img) && (
              <div className="w-full h-32 relative mt-2 rounded-md overflow-hidden">
                <img
                  src={supabase.storage.from('user-images').getPublicUrl(img.storage_path).data.publicUrl}
                  alt={img.prompt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {generatingImages.includes(img) && (
              <div className="w-full space-y-2 mt-2">
                <Skeleton className="w-full h-32" />
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GeneratingImagesDropdown;