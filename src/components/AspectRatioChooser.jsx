import React from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { aspectRatios } from '@/utils/imageConfigs'
import { ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const AspectRatioVisualizer = ({ ratio }) => {
  const [width, height] = ratio.split(':').map(Number)
  const scale = 60 / Math.max(width, height)
  
  return (
    <div className="flex flex-col items-center mb-2 space-y-1">
      <div 
        className="border-2 border-primary bg-muted flex items-center justify-center"
        style={{
          width: `${width * scale}px`,
          height: `${height * scale}px`,
        }}
      >
        <span className="text-xs font-medium">{ratio}</span>
      </div>
    </div>
  )
}

const AspectRatioChooser = ({ aspectRatio, setAspectRatio }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleAspectRatioChange = (value) => {
    const ratios = [
      "9:16", "3:4", "4:5", "1:1", "5:4", "4:3", "16:9"
    ]
    setAspectRatio(ratios[Math.floor((value[0] / 100) * (ratios.length - 1))])
  }

  const getCurrentRatioIndex = () => {
    const ratios = [
      "9:16", "3:4", "4:5", "1:1", "5:4", "4:3", "16:9"
    ]
    return (ratios.indexOf(aspectRatio) / (ratios.length - 1)) * 100
  }

  return (
    <div className="space-y-2">
      <AspectRatioVisualizer ratio={aspectRatio} />
      <Slider
        value={[getCurrentRatioIndex()]}
        onValueChange={handleAspectRatioChange}
        max={100}
        step={1}
        className="w-full"
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            {isOpen ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
            {isOpen ? "Hide presets" : "Show presets"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className="w-full whitespace-nowrap mt-2">
            <div className="flex space-x-2 pb-4">
              {Object.keys(aspectRatios).map((ratio) => (
                <Button
                  key={ratio}
                  variant={aspectRatio === ratio ? "default" : "outline"}
                  className="flex-shrink-0"
                  onClick={() => setAspectRatio(ratio)}
                >
                  {ratio}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default AspectRatioChooser