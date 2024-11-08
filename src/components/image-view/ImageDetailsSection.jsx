import React from 'react';
import { Badge } from "@/components/ui/badge";

const ImageDetailsSection = ({ detailItems }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {detailItems.map((item, index) => (
        <div key={index} className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
          <Badge variant="secondary" className="text-xs sm:text-sm font-normal w-full justify-center">
            {item.value}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default ImageDetailsSection;