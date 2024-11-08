import React from 'react';

const ImageDetailsSection = ({ detailItems }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {detailItems.map((item, index) => (
        <div key={index} className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
          <p className="text-sm font-medium">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ImageDetailsSection;