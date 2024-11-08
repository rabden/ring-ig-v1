import React from 'react';
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Download, Trash, ArrowsClockwise } from "lucide-react";

const MobileImageDrawer = ({ open, onOpenChange, image, showFullImage, onDownload, onDiscard, onRemix, isOwner, setActiveTab, setStyle }) => {
  const handleRemixClick = () => {
    onRemix(image);
    setActiveTab('input');
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Image Details</h3>
          <Button variant="ghost" onClick={onOpenChange}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <img src={image.url} alt={image.prompt} className="mt-4 mb-4 rounded" />
        <p className="text-sm">{image.prompt}</p>

        <div className="mt-4 flex gap-2">
          <Button onClick={onDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {isOwner && (
            <Button onClick={onDiscard} variant="destructive" className="flex-1">
              <Trash className="h-4 w-4 mr-2" />
              Discard
            </Button>
          )}
          <Button onClick={handleRemixClick} className="flex-1">
            <ArrowsClockwise className="h-4 w-4 mr-2" />
            Remix
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileImageDrawer;
