import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const ImageDetailsDialog = ({ open, onOpenChange, image }) => {
  if (!image) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[70vh] bg-card text-card-foreground flex flex-col">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
          <DialogDescription>
            Details of the generated image
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="grid gap-4 py-4 px-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Prompt:</span>
              <span className="col-span-3">{image.prompt}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Model:</span>
              <span className="col-span-3">{image.model}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Seed:</span>
              <span className="col-span-3">{image.seed}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Size:</span>
              <span className="col-span-3">{image.width}x{image.height}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Aspect Ratio:</span>
              <span className="col-span-3">{image.aspect_ratio}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Steps:</span>
              <span className="col-span-3">{image.steps}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Quality:</span>
              <span className="col-span-3">{image.quality}</span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ImageDetailsDialog