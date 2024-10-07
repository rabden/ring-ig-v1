import React from 'react'
import { Button } from "@/components/ui/button"
import { SettingSection } from './ImageGeneratorSettingsHelpers'

const styleOptions = [
  { value: 'general', label: 'General' },
  { value: 'anime', label: 'Anime' },
  { value: 'threeD', label: '3D' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'logo', label: 'Logo' },
  { value: 'graphics', label: 'Graphics' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'oilPainting', label: 'Oil Painting' },
  { value: 'sketch', label: 'Sketch' },
  { value: 'pixelArt', label: 'Pixel Art' },
  { value: 'lowPoly', label: 'Low Poly' },
  { value: 'conceptArt', label: 'Concept Art' },
]

export const StyleSelector = ({ selectedStyle, setSelectedStyle }) => (
  <SettingSection label="Style" tooltip="Choose a style for your generated image.">
    <div className="grid grid-cols-3 gap-2">
      {styleOptions.map((style) => (
        <Button
          key={style.value}
          variant={selectedStyle === style.value ? "default" : "outline"}
          className="w-full text-xs py-1 px-2"
          onClick={() => setSelectedStyle(style.value)}
        >
          {style.label}
        </Button>
      ))}
    </div>
  </SettingSection>
)