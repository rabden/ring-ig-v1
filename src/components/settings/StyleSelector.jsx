import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { styleConfigs } from '@/utils/styleConfigs'
import SettingSection from './SettingSection'

const StyleSelector = ({ style, setStyle }) => (
  <SettingSection 
    label="Style" 
    tooltip="Choose a style to enhance your image generation"
  >
    <ScrollArea className="h-[200px] pr-4">
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(styleConfigs).map(([key, config]) => (
          <Button
            key={key}
            variant={style === key ? "default" : "outline"}
            onClick={() => setStyle(key)}
            className="w-full"
          >
            {config.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  </SettingSection>
)

export default StyleSelector