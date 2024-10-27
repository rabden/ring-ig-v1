import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { HelpCircle } from "lucide-react"
import { qualityOptions } from '@/utils/imageConfigs'
import StyleChooser from './StyleChooser'
import AspectRatioChooser from './AspectRatioChooser'

const SettingSection = ({ label, tooltip, children }) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-3 w-3 p-0 text-muted-foreground hover:text-foreground opacity-70">
            <HelpCircle className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 text-sm" align="start">
          {tooltip}
        </PopoverContent>
      </Popover>
    </div>
    {children}
  </div>
)

const ImageGeneratorSettings = ({
  prompt, setPrompt,
  handlePromptKeyDown,
  generateImage,
  model, setModel,
  seed, setSeed,
  randomizeSeed, setRandomizeSeed,
  quality, setQuality,
  aspectRatio, setAspectRatio,
  session,
  credits,
  nsfwEnabled, setNsfwEnabled,
  style, setStyle
}) => {
  const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
  const hasEnoughCredits = credits >= creditCost;

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Settings</h2>
        {session && (
          <div className="text-sm font-medium">
            Credits: {credits}
            {!hasEnoughCredits && (
              <span className="text-destructive ml-2">
                Need {creditCost} credits for {quality}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Prompt */}
        <SettingSection label="Prompt" tooltip="Enter a description of the image you want to generate. Be as specific as possible for best results.">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handlePromptKeyDown}
            placeholder="Enter your prompt here"
            className="min-h-[40px] resize-none overflow-hidden transition-all duration-200"
            rows={1}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
        </SettingSection>

        {/* Generate Button */}
        <Button 
          onClick={generateImage} 
          className="w-full" 
          disabled={!session || !hasEnoughCredits}
        >
          {!session ? 'Sign in to generate' : !hasEnoughCredits ? `Need ${creditCost} credits for ${quality}` : 'Generate Image'}
        </Button>

        {/* Model */}
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

        {/* Style */}
        <SettingSection label="Style" tooltip="Choose a style to enhance your image generation, or click again to disable">
          <StyleChooser style={style} setStyle={setStyle} />
        </SettingSection>

        {/* Quality */}
        <SettingSection label="Quality" tooltip="Higher quality settings produce more detailed images but require more credits.">
          <Tabs value={quality} onValueChange={setQuality}>
            <TabsList className="grid grid-cols-3 w-full">
              {Object.keys(qualityOptions).map((q) => (
                <TabsTrigger key={q} value={q}>{q}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </SettingSection>

        {/* Aspect Ratio */}
        <SettingSection label="Aspect Ratio" tooltip="Slide left for portrait, center for square, right for landscape">
          <AspectRatioChooser aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
        </SettingSection>

        {/* Seed */}
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

        {/* NSFW Toggle */}
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

      {!session && (
        <div className="absolute inset-0 z-10">
          <AuthOverlay />
        </div>
      )}
    </div>
  )
}

export default ImageGeneratorSettings