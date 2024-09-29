import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const FullScreenImageView = ({ images, currentIndex, isOpen, onClose, onNavigate }) => {
  if (!isOpen || images.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full p-0 bg-background/80 backdrop-blur-sm">
        <div className="relative w-full h-screen flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
          <Carousel className="w-full h-full" defaultIndex={currentIndex}>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={image.id} className="flex items-center justify-center">
                  <img
                    src={image.imageUrl}
                    alt={image.prompt}
                    className="max-w-full max-h-full object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious onClick={() => onNavigate('prev')} />
            <CarouselNext onClick={() => onNavigate('next')} />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;