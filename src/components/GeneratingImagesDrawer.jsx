import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { useStyleConfigs } from '@/hooks/useStyleConfigs'
import { Loader } from "lucide-react"

const GeneratingImagesDrawer = ({ open, onOpenChange, generatingImages = [] }) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();

  if (!generatingImages?.length) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Generating Images</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 space-y-4">
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
                {img.style && modelConfigs?.[img.model]?.category !== "NSFW" && (
                  <>
                    <span>•</span>
                    <span>{styleConfigs?.[img.style]?.name || img.style}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default GeneratingImagesDrawer;