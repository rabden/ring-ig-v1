import React from 'react';
import { Slider } from "@/components/ui/slider";
import SettingSection from './SettingSection';

const GuidanceScaleSection = ({ guidanceScale = 3.5, setGuidanceScale }) => (
  <SettingSection 
    label="Guidance Scale" 
    tooltip="Controls how closely the image follows your prompt. Higher values result in images that more closely match your prompt but may be less diverse."
  >
    <div className="space-y-2">
      <Slider
        value={[guidanceScale]}
        onValueChange={([value]) => setGuidanceScale(value)}
        min={1}
        max={20}
        step={0.1}
        className="w-full"
      />
      <div className="text-sm text-muted-foreground text-right">
        {guidanceScale?.toFixed(1) || "3.5"}
      </div>
    </div>
  </SettingSection>
);

export default GuidanceScaleSection;