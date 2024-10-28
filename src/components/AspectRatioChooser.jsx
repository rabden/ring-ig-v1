import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const AspectRatioVisualizer = ({ ratio }) => {
  const [width, height] = ratio.split(':').map(Number)
  const maxHeight = 100 // Fixed height for consistent vertical space
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
        {ratio}
      </div>
    </div>
  )
}

const AspectRatioChooser = ({ aspectRatio, setAspectRatio }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  // Added 4 more ratios: 1.91:1, 1:1.91, 1:2, and 2:1
  const ratios = [
    "9:21", "9:16", "2:3", "3:4", "4:5", "1:1", 
    "5:4", "4:3", "3:2", "16:9", "21:9",
    "1.91:1", "1:1.91", "1:2", "2:1"
  ]

  const mainRatios = ["1:1", "16:9", "9:16"]

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
      
      {/* Main ratio buttons in ribbon format */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2 flex-grow">
          {mainRatios.map((ratio) => (
            <Button
              key={ratio}
              variant={aspectRatio === ratio ? "default" : "outline"}
              onClick={() => setAspectRatio(ratio)}
              className="flex-1"
            >
              {ratio}
            </Button>
          ))}
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="space-y-4">
          <Slider
            value={[getCurrentRatioIndex()]}
            onValueChange={handleSliderChange}
            max={100}
            step={0.1}
            className="w-full transition-all duration-300"
          />
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