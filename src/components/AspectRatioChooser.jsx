import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const AspectRatioVisualizer = ({ ratio }) => {
  const [width, height] = ratio.split(':').map(Number)
  const scale = 60 / Math.max(width, height) // Increased scale for bigger visualization
  
  return (
    <div className="flex flex-col items-center space-y-2 mb-2">
      <div 
        className="border-2 border-primary bg-muted flex items-center justify-center text-sm"
        style={{
          width: `${width * scale}px`,
          height: `${height * scale}px`,
        }}
      >
        {ratio}
      </div>
    </div>
  )
}

const AspectRatioChooser = ({ aspectRatio, setAspectRatio }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const ratios = [
    "9:16", "3:4", "4:5", "1:1", "5:4", "4:3", "16:9"
  ]

  const handleSliderChange = (value) => {
    const index = Math.floor((value[0] / 100) * (ratios.length - 1))
    setAspectRatio(ratios[index])
  }

  const getCurrentRatioIndex = () => {
    return (ratios.indexOf(aspectRatio) / (ratios.length - 1)) * 100
  }

  return (
    <div className="space-y-4">
      <AspectRatioVisualizer ratio={aspectRatio} />
      <Slider
        value={[getCurrentRatioIndex()]}
        onValueChange={handleSliderChange}
        max={100}
        step={1}
        className="w-full"
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
            {ratios.map((ratio) => (
              <Button
                key={ratio}
                variant={aspectRatio === ratio ? "default" : "outline"}
                onClick={() => setAspectRatio(ratio)}
                className="w-full"
              >
                {ratio}
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default AspectRatioChooser