import React from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { qualityOptions } from '@/utils/imageConfigs'
import SettingSection from './settings/SettingSection'
import StyleSelector from './settings/StyleSelector'
import AspectRatioSelector from './settings/AspectRatioSelector'

const ImageGeneratorSettings = ({
  prompt,
  setPrompt,
  handlePromptKeyDown,
  generateImage,
  model,
  setModel,
  seed,
  setSeed,
  randomizeSeed,
  setRandomizeSeed,
  quality,
  setQuality,
  aspectRatio,
  setAspectRatio,
  session,
  credits,
  style,
  setStyle,
}) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Settings</h2>
        {session && <div className="text-sm font-medium">Credits: {credits}</div>}
      </div>

      <SettingSection 
        label="Prompt" 
        tooltip="Enter a description of the image you want to generate"
      >
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handlePromptKeyDown}
          placeholder="Enter your prompt here"
          className="min-h-[100px] resize-y"
        />
      </SettingSection>

      <Button onClick={generateImage} className="w-full" disabled={!session}>
        Generate Image
      </Button>

      <SettingSection 
        label="Model" 
        tooltip="Choose between fast generation or higher quality output"
      >
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={model === 'flux' ? 'default' : 'outline'}
            onClick={() => setModel('flux')}
          >
            Fast
          </Button>
          <Button
            variant={model === 'fluxDev' ? 'default' : 'outline'}
            onClick={() => setModel('fluxDev')}
          >
            Quality
          </Button>
        </div>
      </SettingSection>

      <StyleSelector style={style} setStyle={setStyle} />

      <SettingSection 
        label="Seed" 
        tooltip="A seed number that initializes the random generation process"
      >
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value))}
            disabled={randomizeSeed}
          />
          <div className="flex items-center space-x-2">
            <Switch
              id="randomizeSeed"
              checked={randomizeSeed}
              onCheckedChange={setRandomizeSeed}
            />
            <label htmlFor="randomizeSeed">Random</label>
          </div>
        </div>
      </SettingSection>

      <SettingSection 
        label="Quality" 
        tooltip="Higher quality settings produce more detailed images"
      >
        <Tabs value={quality} onValueChange={setQuality}>
          <TabsList className="grid grid-cols-3 w-full">
            {Object.keys(qualityOptions).map((q) => (
              <TabsTrigger key={q} value={q}>{q}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </SettingSection>

      <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
    </Card>
  )
}

export default ImageGeneratorSettings