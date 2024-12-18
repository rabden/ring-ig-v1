import React, { useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Lock } from "lucide-react"

const AspectRatioVisualizer = ({ ratio = "1:1", isPremium }) => {
  const [width, height] = (ratio || "1:1").split(':').map(Number)
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
          {isPremium && <Lock className="h-3 w-3" />}
        </div>
      </div>
    </div>
  )
}

const AspectRatioChooser = ({ aspectRatio = "1:1", setAspectRatio, proMode }) => {
  const premiumRatios = ['9:21', '21:9', '3:2', '2:3', '4:5', '5:4', '10:16', '16:10'];
  
  const ratios = [
    "9:21", "1:2", "9:16", "10:16", "2:3", "3:4", "4:5",
    "1:1", // Center point
    "5:4", "4:3", "3:2", "16:10", "16:9", "2:1", "21:9"
  ].filter(ratio => proMode || !premiumRatios.includes(ratio));

  // Check if current aspect ratio is premium and user is not pro
  useEffect(() => {
    if (!proMode && premiumRatios.includes(aspectRatio)) {
      // Revert to default non-premium aspect ratio
      setAspectRatio("1:1");
    }
  }, [aspectRatio, proMode, setAspectRatio]);

  const handleSliderChange = (value) => {
    const centerIndex = ratios.indexOf("1:1");
    const sliderValue = value[0];
    
    if (Math.abs(sliderValue - 50) < 1) {
      setAspectRatio("1:1");
      return;
    }
    
    let index;
    if (sliderValue < 50) {
      const beforeCenterSteps = centerIndex;
      const normalizedValue = (sliderValue / 50) * beforeCenterSteps;
      index = Math.round(normalizedValue);
    } else {
      const afterCenterSteps = ratios.length - 1 - centerIndex;
      const normalizedValue = ((sliderValue - 50) / 50) * afterCenterSteps;
      index = centerIndex + Math.round(normalizedValue);
    }
    
    setAspectRatio(ratios[index] || "1:1");
  }

  const getCurrentRatioIndex = () => {
    const centerIndex = ratios.indexOf("1:1");
    const currentIndex = ratios.indexOf(aspectRatio);
    
    if (currentIndex === centerIndex || !ratios.includes(aspectRatio)) return 50;
    
    if (currentIndex < centerIndex) {
      return (currentIndex / centerIndex) * 50;
    } else {
      const stepsAfterCenter = currentIndex - centerIndex;
      const totalStepsAfterCenter = ratios.length - 1 - centerIndex;
      return 50 + ((stepsAfterCenter / totalStepsAfterCenter) * 50);
    }
  }

  return (
    <div className="space-y-4">
      <AspectRatioVisualizer 
        ratio={aspectRatio} 
        isPremium={!proMode && premiumRatios.includes(aspectRatio)} 
      />
      <Slider
        value={[getCurrentRatioIndex()]}
        onValueChange={handleSliderChange}
        max={100}
        step={1}
        className="w-full transition-all duration-300"
      />
    </div>
  )
}

export default AspectRatioChooser
