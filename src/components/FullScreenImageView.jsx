import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FullScreenImageView = ({ image, isOpen, onClose }) => {
  if (!isOpen || !image) {
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
          <img
            src={image.imageUrl}
            alt={image.prompt}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;