import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { Loader } from "lucide-react"

const GeneratingImagesDrawer = ({ open, onOpenChange, generatingImages = [] }) => {
  const { data: modelConfigs } = useModelConfigs();

  if (!generatingImages?.length) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[50vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle>Generating Images</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
          {generatingImages.map((img) => (
            <div key={img.id} className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="font-medium">Generating...</span>
                <Badge variant="secondary" className="ml-auto">
                  {img.width}x{img.height}
                </Badge>
              </div>
              {img.prompt && (
                <p className="text-sm text-muted-foreground">
                  {img.prompt.length > 100 ? `${img.prompt.substring(0, 100)}...` : img.prompt}
                </p>
              )}
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{modelConfigs?.[img.model]?.name || img.model}</span>
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default GeneratingImagesDrawer;