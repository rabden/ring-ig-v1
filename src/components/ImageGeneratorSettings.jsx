import React from 'react'
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
import { modelConfigs } from '@/utils/modelConfigs'

// Helper components (SettingTooltip and SettingSection) remain unchanged

const styleOptions = [
  { name: 'Anime', suffix: ', anime style' },
  { name: '3D', suffix: ', 3D render' },
  { name: 'Realistic', suffix: ', photorealistic' },
  { name: 'Illustration', suffix: ', digital illustration' },
  { name: 'Logo', suffix: ', logo design' },
  { name: 'Graphics', suffix: ', graphic design' },
]

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
  steps,
  setSteps,
  session,
  credits,
  nsfwEnabled,
  setNsfwEnabled,
  selectedStyle,
  setSelectedStyle
}) => {
  const currentModel = model && modelConfigs[model] ? modelConfigs[model] : null;

  const handleModelSelection = (selectedModel) => {
    setModel(selectedModel);
    setSteps(modelConfigs[selectedModel].defaultStep);
  };

  const handleStyleSelection = (style) => {
    if (selectedStyle === style) {
      setSelectedStyle(null);
    } else {
      setSelectedStyle(style);
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-0">
        {session && <div className="text-sm font-medium">Credits: {credits}</div>}
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
        <Button onClick={() => generateImage(selectedStyle)} className="w-full" disabled={!session}>
          Generate Image
        </Button>
        <SettingSection label="Model" tooltip="Choose the AI model to use for image generation.">
          <div className="flex space-x-2">
            {nsfwEnabled ? (
              <>
                <Button
                  variant={model === 'nsfwMaster' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleModelSelection('nsfwMaster')}
                >
                  Reality
                </Button>
                <Button
                  variant={model === 'animeNsfw' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleModelSelection('animeNsfw')}
                >
                  Anime
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={model === 'flux' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleModelSelection('flux')}
                >
                  Fast
                </Button>
                <Button
                  variant={model === 'fluxDev' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleModelSelection('fluxDev')}
                >
                  Quality
                </Button>
              </>
            )}
          </div>
        </SettingSection>
        <SettingSection label="Style" tooltip="Choose a style for your generated image.">
          <div className="grid grid-cols-3 gap-2">
            {styleOptions.map((style) => (
              <Button
                key={style.name}
                variant={selectedStyle === style ? 'default' : 'outline'}
                className="text-xs py-1 px-2"
                onClick={() => handleStyleSelection(style)}
              >
                {style.name}
              </Button>
            ))}
          </div>
        </SettingSection>
        <SettingSection label="Quality" tooltip="Higher quality settings produce more detailed images but require more processing time and credits.">
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
        {currentModel && (
          <SettingSection label="Inference Steps" tooltip="The number of denoising steps. More steps can result in higher quality images but take longer to generate.">
            <Tabs value={steps.toString()} onValueChange={(value) => setSteps(parseInt(value))}>
              <TabsList className="grid grid-cols-5 w-full">
                {currentModel.inferenceSteps.map((step) => (
                  <TabsTrigger key={step} value={step.toString()}>
                    {step}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </SettingSection>
        )}
        <div className="flex items-center justify-between">
          <SettingSection label="Enable NSFW Content" tooltip="Toggle to allow or disallow the generation of Not Safe For Work (NSFW) content.">
            <Switch
              id="nsfwToggle"
              checked={nsfwEnabled}
              onCheckedChange={(checked) => {
                setNsfwEnabled(checked);
                if (checked) {
                  handleModelSelection('nsfwMaster');
                } else {
                  handleModelSelection('flux');
                }
              }}
            />
          </SettingSection>
        </div>
      </div>
    </div>
  )
}

export default ImageGeneratorSettings
