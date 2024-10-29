import React from 'react';
import { Badge } from "@/components/ui/badge";
import { modelConfigs } from '@/utils/modelConfigs';
import { styleConfigs } from '@/utils/styleConfigs';

const ImageDetails = ({ image }) => {
  const detailItems = [
    { label: "Model", value: modelConfigs[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Style", value: styleConfigs[image.style]?.name || 'General' },
    { label: "Quality", value: image.quality },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {detailItems.map((item, index) => (
        <div key={index} className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
          <Badge variant="secondary" className="text-sm font-normal">
            {item.value}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default ImageDetails;