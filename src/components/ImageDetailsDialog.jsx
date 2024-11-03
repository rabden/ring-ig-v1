import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import ImageDetails from './image-details/ImageDetails'
import { useStyleConfigs } from '@/hooks/useStyleConfigs'
import { useModelConfigs } from '@/hooks/useModelConfigs'

const ImageDetailsDialog = ({ open, onOpenChange, image }) => {
  const { data: styleConfigs } = useStyleConfigs();
  const { data: modelConfigs } = useModelConfigs();
  
  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Image Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[calc(80vh-100px)]">
          <div className="p-4">
            <ImageDetails
              image={image}
              modelConfigs={modelConfigs}
              styleConfigs={styleConfigs}
              showTitle={false}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsDialog;