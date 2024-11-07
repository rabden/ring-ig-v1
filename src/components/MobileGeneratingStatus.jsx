import React from 'react';
import { Loader2 } from 'lucide-react';

const MobileGeneratingStatus = ({ generatingImages }) => {
  if (!generatingImages || generatingImages.length === 0) return null;

  return (
    <div className="fixed bottom-[72px] left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/30 md:hidden z-50">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-3">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Generating {generatingImages.length} image{generatingImages.length > 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};

export default MobileGeneratingStatus;