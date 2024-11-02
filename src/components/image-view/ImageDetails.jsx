import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

const ImageDetails = ({ image, copyPromptIcon, copyShareIcon, handleCopyPromptWithIcon, handleShareWithIcon }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Image Details</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopyPromptWithIcon}>
            {copyPromptIcon}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShareWithIcon}>
            {copyShareIcon}
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md break-words">
        {image.prompt}
      </p>
    </div>
  );
};

export default ImageDetails;