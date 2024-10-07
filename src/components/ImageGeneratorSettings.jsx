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
import { SettingTooltip, SettingSection } from './ImageGeneratorSettingsHelpers'

const styleOptions = [
  { value: 'anime', label: 'Anime' },
  { value: '3D', label: '3D' },
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

const styleSuffixes = {
  anime: 'in a highly detailed anime art style, with vibrant colors, dynamic lighting, clean lines, expressive facial features, large eyes, and a stylized background. The characters should have smooth, cel-shaded textures and distinct, exaggerated emotions, similar to traditional Japanese animation. The atmosphere should be lively, with intricate attention to details in the scenery and character clothing.',
  '3D': 'in a photorealistic 3D rendered style, with high-quality textures, accurate lighting and shadows, and detailed surface materials. The image should have depth and dimensionality, as if created using advanced 3D modeling and rendering software.',
  realistic: 'in a hyper-realistic style, with extreme attention to detail, accurate lighting, and true-to-life textures. The image should look as close to a high-resolution photograph as possible, capturing subtle nuances and imperfections found in reality.',
  illustration: 'in a professional illustration style, with clean lines, bold colors, and a balance of detail and simplicity. The image should have a polished, commercial quality suitable for book covers, magazines, or digital media.',
  logo: 'as a minimalist, memorable logo design. The image should be simple yet distinctive, using basic shapes, clever negative space, and a limited color palette. It should be scalable and recognizable even at small sizes.',
  graphics: 'as a modern graphic design, with bold geometric shapes, vibrant colors, and a strong sense of composition. The style should be clean and contemporary, suitable for posters, album covers, or digital media.',
  watercolor: 'in a soft, ethereal watercolor style, with gentle color washes, subtle blending, and delicate details. The image should have a light, airy quality with visible brush strokes and paper texture, capturing the translucent nature of watercolor paints.',
  oilPainting: 'in the style of a classical oil painting, with rich, textured brush strokes, deep colors, and a sense of depth achieved through layering. The image should have the look of canvas texture and the characteristic glossiness of oil paints.',
  sketch: 'as a hand-drawn sketch, with loose, expressive lines and a sense of spontaneity. The image should have a raw, unfinished quality, using hatching and cross-hatching for shading, and varying line weights to create depth and focus.',
  pixelArt: 'in a retro pixel art style, with a limited color palette and visible square pixels. The image should have a nostalgic, 8-bit or 16-bit video game aesthetic, with careful attention to detail despite the low resolution.',
  lowPoly: 'in a low poly 3D style, with simplified geometric shapes and flat or gradient color fills. The image should have a modern, stylized look with visible polygonal structures, creating a balance between abstraction and recognition.',
  conceptArt: 'as a piece of concept art, with a focus on mood, atmosphere, and world-building. The image should be detailed and imaginative, suitable for visualizing environments, characters, or scenes for films, video games, or other media productions.',
}

const ImageGeneratorSettings = ({
  prompt, setPrompt, handlePromptKeyDown, generateImage, model, setModel,
  seed, setSeed, randomizeSeed, setRandomizeSeed, quality, setQuality,
  useAspectRatio, setUseAspectRatio, aspectRatio, setAspectRatio,
  width, setWidth, height, setHeight, steps, setSteps,
  session, credits, nsfwEnabled, setNsfwEnabled,
  selectedStyle, setSelectedStyle
}) => {
  const currentModel = model && modelConfigs[model] ? modelConfigs[model] : null;

  const handleModelSelection = (selectedModel) => {
    setModel(selectedModel);
    setSteps(modelConfigs[selectedModel].defaultStep);
  };

  const handleStyleSelection = (style) => {
    setSelectedStyle(style);
    setPrompt((prevPrompt) => `${prevPrompt} ${styleSuffixes[style]}`);
  };

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
        <SettingSection label="Model" tooltip="Choose the AI model to use for image generation.">
          <div className="flex space-x-2">
            {nsfwEnabled ? (
              <>
                <Button variant={model === 'nsfwMaster' ? 'default' : 'outline'} className="flex-1" onClick={() => handleModelSelection('nsfwMaster')}>Reality</Button>
                <Button variant={model === 'animeNsfw' ? 'default' : 'outline'} className="flex-1" onClick={() => handleModelSelection('animeNsfw')}>Anime</Button>
              </>
            ) : (
              <>
                <Button variant={model === 'flux' ? 'default' : 'outline'} className="flex-1" onClick={() => handleModelSelection('flux')}>Fast</Button>
                <Button variant={model === 'fluxDev' ? 'default' : 'outline'} className="flex-1" onClick={() => handleModelSelection('fluxDev')}>Quality</Button>
              </>
            )}
          </div>
        </SettingSection>
        <SettingSection label="Style" tooltip="Choose a style for your generated image.">
          <div className="grid grid-cols-3 gap-2">
            {styleOptions.map((style) => (
              <Button
                key={style.value}
                variant={selectedStyle === style.value ? "default" : "outline"}
                className="w-full text-xs py-1 px-2"
                onClick={() => handleStyleSelection(style.value)}
              >
                {style.label}
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
