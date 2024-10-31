import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Crown } from "lucide-react"
import { styleConfigs } from '@/utils/styleConfigs'

const StyleChooser = ({ style, setStyle }) => {
  const premiumStyles = [
    'anime', '3d', 'realistic', 'illustration', 
    'concept', 'watercolor', 'comic', 'minimalist', 
    'cyberpunk', 'retro'
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
        {Object.entries(styleConfigs).map(([key, config]) => (
          <Button
            key={key}
            variant={style === key ? "default" : "outline"}
            onClick={() => handleStyleClick(key)}
            className="flex-shrink-0 flex items-center gap-1"
          >
            {config.name}
            {premiumStyles.includes(key) && <Crown className="h-3 w-3" />}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default StyleChooser