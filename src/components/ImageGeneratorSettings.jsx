import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { HelpCircle } from "lucide-react"
import { aspectRatios, qualityOptions } from '@/utils/imageConfigs'
import { styleConfigs } from '@/utils/styleConfigs'

const SettingTooltip = ({ content }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" className="h-3 w-3 p-0 text-muted-foreground hover:text-foreground opacity-70">
        <HelpCircle className="h-3 w-3" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80 text-sm" align="start">
      {content}
    </PopoverContent>
  </Popover>
)

const SettingSection = ({ label, tooltip, children }) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Label>{label}</Label>
      <SettingTooltip content={tooltip} />
    </div>
    {children}
  </div>
)

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
  useAspectRatio,
  setUseAspectRatio,
  aspectRatio,
  setAspectRatio,
  width,
  setWidth,
  height,
  setHeight,
  session,
  credits,
  nsfwEnabled,
  setNsfwEnabled,
  style,
  setStyle
}) => {
  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Settings</h2>
        {session && <div className="text-sm font-medium">Credits: {credits}</div>}
      </div>
      <div className="space-y-4">
        <SettingSection label="Prompt" tooltip="Enter a description of the image you want to generate. Be as specific as possible for best results.">
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
        <SettingSection label="Model" tooltip="Choose between fast generation or higher quality output.">
          <div className="grid grid-cols-2 gap-2">
            {!nsfwEnabled ? (
              <>
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
              </>
            ) : (
              <>
                <Button
                  variant={model === 'nsfwMaster' ? 'default' : 'outline'}
                  onClick={() => setModel('nsfwMaster')}
                >
                  Reality
                </Button>
                <Button
                  variant={model === 'animeNsfw' ? 'default' : 'outline'}
                  onClick={() => setModel('animeNsfw')}
                >
                  Anime
                </Button>
              </>
            )}
          </div>
        </SettingSection>
        <SettingSection label="Style" tooltip="Choose a style to enhance your image generation">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {Object.entries(styleConfigs).map(([key, config]) => (
              <Button
                key={key}
                variant={style === key ? "default" : "outline"}
                onClick={() => setStyle(key)}
                className="w-full text-xs py-1 px-2"
              >
                {config.name}
              </Button>
            ))}
          </div>
        </SettingSection>
        <SettingSection label="Seed" tooltip="A seed is a number that initializes the random generation process. Using the same seed with the same settings will produce the same image.">
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
              <Label htmlFor="randomizeSeed">Random</Label>
            </div>
          </div>
        </SettingSection>
        <SettingSection label="Quality" tooltip="Higher quality settings produce more detailed images but require more credits.">
          <Tabs value={quality} onValueChange={setQuality}>
            <TabsList className="grid grid-cols-3 w-full">
              {Object.keys(qualityOptions).map((q) => (
                <TabsTrigger key={q} value={q}>{q}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </SettingSection>
        <SettingSection label="Use Aspect Ratio" tooltip="Choose a predefined aspect ratio for your image, or set custom dimensions below.">
          <div className="flex items-center justify-between">
            <Switch
              checked={useAspectRatio}
              onCheckedChange={setUseAspectRatio}
            />
          </div>
          {useAspectRatio ? (
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(aspectRatios).map((ratio) => (
                <Button
                  key={ratio}
                  variant={aspectRatio === ratio ? "default" : "outline"}
                  className="w-full text-xs py-1 px-2"
                  onClick={() => setAspectRatio(ratio)}
                >
                  {ratio}
                </Button>
              ))}
            </div>
          ) : (
            <>
              <SettingSection label={`Width: ${width}px`} tooltip="Set the width of the generated image in pixels.">
                <Slider
                  min={256}
                  max={qualityOptions[quality]}
                  step={8}
                  value={[width]}
                  onValueChange={(value) => setWidth(value[0])}
                />
              </SettingSection>
              <SettingSection label={`Height: ${height}px`} tooltip="Set the height of the generated image in pixels.">
                <Slider
                  min={256}
                  max={qualityOptions[quality]}
                  step={8}
                  value={[height]}
                  onValueChange={(value) => setHeight(value[0])}
                />
              </SettingSection>
            </>
          )}
        </SettingSection>
        <div className="flex items-center justify-between">
          <SettingSection label="Enable NSFW Content" tooltip="Toggle to allow or disallow the generation of Not Safe For Work (NSFW) content.">
            <Switch
              id="nsfwToggle"
              checked={nsfwEnabled}
              onCheckedChange={setNsfwEnabled}
            />
          </SettingSection>
        </div>
      </div>
    </div>
  )
}

export default ImageGeneratorSettings
