import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Crown, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { aspectRatios } from '@/utils/imageConfigs'

const AspectRatioVisualizer = ({ ratio, isPremium }) => {
  const [width, height] = ratio.split(':').map(Number)
  const maxHeight = 120
  const scale = maxHeight / height
  const scaledWidth = width * scale
  
  return (
    <div className="flex flex-col items-center space-y-2 mb-2">
      <div 
        className="border-2 border-primary bg-muted flex items-center justify-center text-sm transition-all duration-300 ease-in-out"
        style={{
          width: `${scaledWidth}px`,
          height: `${maxHeight}px`,
        }}
      >
        <div className="flex items-center gap-1">
          {ratio}
          {isPremium && <Crown className="h-3 w-3" />}
        </div>
      </div>
    </div>
  )
}

const AspectRatioChooser = ({ aspectRatio, setAspectRatio, proMode }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const premiumRatios = ['9:21', '21:9', '3:2', '2:3', '4:5', '5:4'];
  
  const ratios = [
    "9:21", "9:16", "2:3", "3:4", "4:5", "10:16", "1:2", 
    "1:1", 
    "5:4", "4:3", "3:2", "16:10", "16:9", "2:1", "21:9"
  ].filter(ratio => proMode || !premiumRatios.includes(ratio));

  const handleSliderChange = (value) => {
    const index = Math.floor((value[0] / 100) * (ratios.length - 1))
    setAspectRatio(ratios[index])
  }

  const getCurrentRatioIndex = () => {
    const index = ratios.indexOf(aspectRatio);
    return index >= 0 ? (index / (ratios.length - 1)) * 100 : 0;
  }

  return (
    <div className="space-y-4">
      <AspectRatioVisualizer ratio={aspectRatio} isPremium={premiumRatios.includes(aspectRatio)} />
      <Slider
        value={[getCurrentRatioIndex()]}
        onValueChange={handleSliderChange}
        max={100}
        step={0.1}
        className="w-full transition-all duration-300"
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            {isOpen ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
            Choose Preset Ratio
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(aspectRatios).map((ratio) => (
              <Button
                key={ratio}
                variant={aspectRatio === ratio ? "default" : "outline"}
                onClick={() => setAspectRatio(ratio)}
                className="w-full flex items-center justify-center gap-1"
                disabled={!proMode && premiumRatios.includes(ratio)}
              >
                {ratio}
                {premiumRatios.includes(ratio) && <Crown className="h-3 w-3" />}
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default AspectRatioChooser