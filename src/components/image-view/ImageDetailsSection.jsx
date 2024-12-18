import React from 'react';

const ImageDetailsSection = ({ detailItems }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-1">
      {detailItems.map((item, index) => (
        <div key={index} className="space-y-1.5 rounded-xl bg-muted/5 p-3 transition-colors hover:bg-muted/10">
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">{item.label}</p>
          <p className="text-sm font-medium text-foreground/90">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ImageDetailsSection;