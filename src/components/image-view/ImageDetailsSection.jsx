import React from 'react';

const ImageDetailsSection = ({ detailItems }) => {
  return (
    <div className="grid grid-cols-2 gap-0 p-1">
      {detailItems.map((item, index) => (
        <div key={index} className="space-y-0.5 rounded-lg bg-muted/5 transition-colors hover:bg-muted/10">
          <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">{item.label}</p>
          <p className="text-xs font-medium text-foreground/90">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ImageDetailsSection;