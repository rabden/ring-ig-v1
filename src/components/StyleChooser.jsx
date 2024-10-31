import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Crown } from "lucide-react"
import { styleConfigs } from '@/utils/styleConfigs'

const StyleChooser = ({ style, setStyle, proMode }) => {
  const premiumStyles = [
    'comic', 'retro', 'abstract', '3d', 'oil', 
    'portrait', 'architectural', 'pop', 'watercolor'
  ];

  const handleStyleClick = (key) => {
    if (style === key) {
      setStyle(null)
    } else {
      setStyle(key)
    }
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-4">
        {Object.entries(styleConfigs).map(([key, config]) => {
          const isPremium = premiumStyles.includes(key);
          const isDisabled = !proMode && isPremium;
          
          return (
            <Button
              key={key}
              variant={style === key ? "default" : "outline"}
              onClick={() => handleStyleClick(key)}
              className="flex-shrink-0 flex items-center gap-1"
              disabled={isDisabled}
            >
              {config.name}
              {isPremium && <Crown className="h-3 w-3" />}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default StyleChooser