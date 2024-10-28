import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { styleConfigs } from '@/utils/styleConfigs'

const StyleChooser = ({ style, setStyle }) => {
  const handleStyleClick = (key) => {
    // If clicking the currently active style, deactivate it by setting to 'auto'
    if (style === key) {
      setStyle('auto');
    } else {
      setStyle(key);
    }
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-4">
        <Button
          variant={style === 'auto' ? "default" : "outline"}
          onClick={() => handleStyleClick('auto')}
          className="flex-shrink-0"
        >
          Auto
        </Button>
        {Object.entries(styleConfigs)
          .filter(([key]) => key !== 'auto')
          .map(([key, config]) => (
            <Button
              key={key}
              variant={style === key ? "default" : "outline"}
              onClick={() => handleStyleClick(key)}
              className="flex-shrink-0"
            >
              {config.name}
            </Button>
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default StyleChooser