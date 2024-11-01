import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { Badge } from "@/components/ui/badge";

const MobileGeneratingStatus = ({ generatingImages }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();

  if (!generatingImages?.length) return null;

  return (
    <div className="fixed bottom-[56px] left-0 right-0 bg-background/70 backdrop-blur-xl border-t border-border/30 md:hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span>Generating-{generatingImages.length}</span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isExpanded && "transform rotate-180"
        )} />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-3 space-y-3">
          {generatingImages.map((img) => (
            <div key={img.id} className="space-y-1.5">
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium text-sm">Generating...</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {img.width}x{img.height}
                </Badge>
              </div>
              {img.prompt && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {img.prompt}
                </p>
              )}
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{modelConfigs?.[img.model]?.name || img.model}</span>
                {img.style && modelConfigs?.[img.model]?.category !== "NSFW" && (
                  <>
                    <span>•</span>
                    <span>{styleConfigs?.[img.style]?.name || img.style}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileGeneratingStatus;