import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Lock } from "lucide-react"
import { useStyleConfigs } from '@/hooks/useStyleConfigs'

const StyleChooser = ({ style, setStyle, proMode, isNsfwMode }) => {
  const { data: styleConfigs, isLoading } = useStyleConfigs();

  if (isLoading || !styleConfigs || isNsfwMode) {
    return null;
  }

  const handleStyleClick = (key) => {
    if (typeof setStyle !== 'function') {
      console.error('setStyle is not a function');
      return;
    }
    
    // If user clicks on currently selected style or a premium style without pro access,
    // clear the style selection
    if (style === key || (!proMode && styleConfigs[key]?.isPremium)) {
      setStyle(null);
    } else {
      setStyle(key);
    }
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-4">
        {Object.entries(styleConfigs).map(([key, config]) => {
          const isDisabled = !proMode && config.isPremium;
          
          return (
            <Button
              key={key}
              variant={style === key ? "default" : "outline"}
              onClick={() => handleStyleClick(key)}
              className="flex-shrink-0 flex items-center gap-1"
              disabled={isDisabled}
            >
              {config.name}
              {config.isPremium && !proMode && <Lock className="h-3 w-3" />}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default StyleChooser;