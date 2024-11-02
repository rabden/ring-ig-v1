import React from 'react';
import { Badge } from "@/components/ui/badge";

const ImageSettings = ({ modelConfigs, styleConfigs, image }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Model</p>
        <Badge variant="outline" className="text-xs sm:text-sm font-normal">
          {modelConfigs?.[image.model]?.name || image.model}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Style</p>
        <Badge variant="outline" className="text-xs sm:text-sm font-normal">
          {styleConfigs?.[image.style]?.name || "General"}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Size</p>
        <Badge variant="outline" className="text-xs sm:text-sm font-normal">
          {image.width}x{image.height}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Quality</p>
        <Badge variant="outline" className="text-xs sm:text-sm font-normal">
          {image.quality}
        </Badge>
      </div>
    </div>
  );
};

export default ImageSettings;