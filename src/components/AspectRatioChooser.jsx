import React, { useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const AspectRatioVisualizer = ({ ratio = "1:1", isPremium }) => {
  const [width, height] = (ratio || "1:1").split(':').map(Number)
  const maxHeight = 120
  const scale = maxHeight / height
  const scaledWidth = width * scale
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className={cn(
          "relative overflow-hidden",
          "border-2 border-border/80",
          "bg-accent/10 hover:bg-accent/20",
          "rounded-2xl",
          "flex items-center justify-center",
          "transition-all duration-200 ease-in-out",
          isPremium && "ring-2 ring-primary/40 border-primary/40"
        )}
        style={{
          width: `${scaledWidth}px`,
          height: `${maxHeight}px`,
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="border border-border/40 hover:border-border/60 transition-colors duration-200"
            />
          ))}
        </div>
        
        {/* Center lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[2px] bg-border/40" />
          <div className="absolute h-full w-[2px] bg-border/60" />
        </div>

        {/* Helper lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[2px] h-2 border-border/40" />
          <div className="absolute top-0 right-1/3 w-[2px] h-2 border-border/40" />
          <div className="absolute bottom-0 left-1/3 w-[2px] h-2 border-border/40" />
          <div className="absolute bottom-0 right-1/3 w-[2px] h-2 border-border/40" />
          <div className="absolute left-0 top-1/3 h-[2px] w-2 border-border/40" />
          <div className="absolute left-0 bottom-1/3 h-[2px] w-2 border-border/40" />
          <div className="absolute right-0 top-1/3 h-[2px] w-2 border-border/40" />
          <div className="absolute right-0 bottom-1/3 h-[2px] w-2 border-border/40" />
        </div>

        <div className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-xl",
        )}>
          <span className="group-hover:text-primary transition-colors duration-200">
            {ratio}
          </span>
          {isPremium && (
            <Lock className="h-3.5 w-3.5 text-primary opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
          )}
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

  useEffect(() => {
    if (!proMode && premiumRatios.includes(aspectRatio)) {
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
    <div className="space-y-3">
      <AspectRatioVisualizer 
        ratio={aspectRatio} 
        isPremium={!proMode && premiumRatios.includes(aspectRatio)} 
      />
      <div className="px-2">
        <Slider
          value={[getCurrentRatioIndex()]}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default AspectRatioChooser
