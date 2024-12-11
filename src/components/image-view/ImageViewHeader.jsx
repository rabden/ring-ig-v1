import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ImageViewHeader = ({ onClose }) => (
  <div className="absolute left-4 top-4 z-50">
    <Button 
      variant="ghost" 
      size="icon"
      onClick={onClose}
      className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
    >
      <ArrowLeft className="h-6 w-6" />
    </Button>
  </div>
);

export default ImageViewHeader;