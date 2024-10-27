import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { styleConfigs } from '@/utils/styleConfigs'

const StyleChooser = ({ style, setStyle }) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-4">
        {Object.entries(styleConfigs).map(([key, config]) => (
          <Button
            key={key}
            variant={style === key ? "default" : "outline"}
            onClick={() => setStyle(style === key ? null : key)}
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