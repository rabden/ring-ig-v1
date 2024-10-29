import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { styleConfigs } from '@/utils/styleConfigs'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const StyleChooser = ({ style, setStyle, autoStyle, setAutoStyle }) => {
  const handleStyleClick = (key) => {
    if (autoStyle) return; // Prevent manual selection when auto style is enabled
    
    // If clicking the active style, deselect it
    if (style === key) {
      setStyle(null)
    } else {
      setStyle(key)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="auto-style" className="text-sm font-medium">Auto Style</Label>
        <Switch
          id="auto-style"
          checked={autoStyle}
          onCheckedChange={setAutoStyle}
        />
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-4">
          {Object.entries(styleConfigs).map(([key, config]) => (
            <Button
              key={key}
              variant={style === key ? "default" : "outline"}
              onClick={() => handleStyleClick(key)}
              className="flex-shrink-0"
              disabled={autoStyle}
            >
              {config.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

export default StyleChooser