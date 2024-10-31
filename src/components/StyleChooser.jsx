import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Crown } from "lucide-react"
import { useStyleConfigs } from '@/hooks/useStyleConfigs'

const StyleChooser = ({ style, setStyle, proMode }) => {
  const { data: styleConfigs, isLoading } = useStyleConfigs();

  if (isLoading || !styleConfigs) {
    return null;
  }

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
              {config.isPremium && <Crown className="h-3 w-3" />}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default StyleChooser