import React from 'react'
import { Button } from "@/components/ui/button"
import { aspectRatios } from '@/utils/imageConfigs'
import SettingSection from './SettingSection'

const AspectRatioSelector = ({ aspectRatio, setAspectRatio }) => (
  <SettingSection 
    label="Aspect Ratio" 
    tooltip="Choose the dimensions ratio for your image"
  >
    <div className="grid grid-cols-3 gap-2">
      {Object.keys(aspectRatios).map((ratio) => (
        <Button
          key={ratio}
          variant={aspectRatio === ratio ? "default" : "outline"}
          className="w-full"
          onClick={() => setAspectRatio(ratio)}
        >
          {ratio}
        </Button>
      ))}
    </div>
  </SettingSection>
)

export default AspectRatioSelector