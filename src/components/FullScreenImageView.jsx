import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FullScreenImageView = ({ images, currentIndex, isOpen, onClose, onNavigate }) => {
  // Check if images is undefined or empty
  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  if (!isOpen || !currentImage) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full p-0 bg-background/80 backdrop-blur-sm">
        <div className="relative w-full h-screen flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            onClick={() => onNavigate('prev')}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <img
            src={currentImage.image_url}
            alt={currentImage.prompt}
            className="max-w-full max-h-full object-contain"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={() => onNavigate('next')}
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;