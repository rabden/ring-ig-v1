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
  
  const premiumRatios = ['9:21', '21:9', '3:2', '2:3', '4:5', '5:4', '10:16', '16:10'];
  
  // Organize ratios from portrait to square to landscape
  const ratios = [
    "9:21", "9:16", "2:3", "3:4", "4:5", "10:16", "1:2", 
    "1:1", // Center point
    "2:1", "5:4", "4:3", "3:2", "16:10", "16:9", "21:9"
  ].filter(ratio => proMode || !premiumRatios.includes(ratio));

  const handleSliderChange = (value) => {
    const centerIndex = ratios.indexOf("1:1");
    const totalSteps = ratios.length - 1;
    const sliderValue = value[0];
    
    // Calculate index based on slider position relative to center
    let index;
    if (sliderValue === 50) {
      index = centerIndex;
    } else if (sliderValue < 50) {
      // Map 0-49 to indices before center
      const beforeCenterSteps = centerIndex;
      const normalizedValue = (sliderValue / 50) * beforeCenterSteps;
      index = Math.floor(normalizedValue);
    } else {
      // Map 51-100 to indices after center
      const afterCenterSteps = totalSteps - centerIndex;
      const normalizedValue = ((sliderValue - 50) / 50) * afterCenterSteps;
      index = centerIndex + Math.ceil(normalizedValue);
    }
    
    setAspectRatio(ratios[index]);
  }

  const getCurrentRatioIndex = () => {
    const centerIndex = ratios.indexOf("1:1");
    const currentIndex = ratios.indexOf(aspectRatio);
    
    if (currentIndex === centerIndex) return 50;
    
    if (currentIndex < centerIndex) {
      // Before center: map to 0-49
      return (currentIndex / centerIndex) * 50;
    } else {
      // After center: map to 51-100
      const stepsAfterCenter = currentIndex - centerIndex;
      const totalStepsAfterCenter = ratios.length - 1 - centerIndex;
      return 50 + ((stepsAfterCenter / totalStepsAfterCenter) * 50);
    }
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