import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { aspectRatios, qualityOptions } from '@/utils/imageConfigs'
import { modelConfigs } from '@/utils/modelConfigs'

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
  setModelSidebarOpen,
  session,
  credits,
}) => {
  // Check if model is defined and exists in modelConfigs
  const currentModel = model && modelConfigs[model] ? modelConfigs[model] : null;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Settings</h2>
        {session && (
          <div className="text-sm font-medium">
            Credits: {credits}
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="promptInput">Prompt</Label>
          <Textarea
            id="promptInput"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handlePromptKeyDown}
            placeholder="Enter your prompt here"
            className="min-h-[100px] resize-y"
          />
        </div>
        <Button onClick={generateImage} className="w-full" disabled={!session}>
          Generate Image
        </Button>
        <div className="space-y-2">
          <Label htmlFor="modelSelect">Model</Label>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setModelSidebarOpen(true)}
          >
            {currentModel ? currentModel.name : "Select a model"}
            {currentModel && <span className="ml-2 opacity-50">{currentModel.category}</span>}
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seedInput">Seed</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="seedInput"
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
        </div>
        <div className="space-y-2">
          <Label>Quality</Label>
          <Tabs value={quality} onValueChange={setQuality}>
            <TabsList className="grid grid-cols-4 w-full">
              {Object.keys(qualityOptions).map((q) => (
                <TabsTrigger key={q} value={q}>{q}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Use Aspect Ratio</Label>
            <Switch
              checked={useAspectRatio}
              onCheckedChange={setUseAspectRatio}
            />
          </div>
          {useAspectRatio && (
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
          )}
          {!useAspectRatio && (
            <>
              <div className="space-y-2">
                <Label>Width: {width}px</Label>
                <Slider
                  min={256}
                  max={qualityOptions[quality]}
                  step={8}
                  value={[width]}
                  onValueChange={(value) => setWidth(value[0])}
                />
              </div>
              <div className="space-y-2">
                <Label>Height: {height}px</Label>
                <Slider
                  min={256}
                  max={qualityOptions[quality]}
                  step={8}
                  value={[height]}
                  onValueChange={(value) => setHeight(value[0])}
                />
              </div>
            </>
          )}
        </div>
        {currentModel && (
          <div className="space-y-2">
            <Label>Inference Steps</Label>
            <Tabs value={steps.toString()} onValueChange={(value) => setSteps(parseInt(value))}>
              <TabsList className="grid grid-cols-5 w-full">
                {currentModel.inferenceSteps.map((step) => (
                  <TabsTrigger key={step} value={step.toString()}>
                    {step}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>
    </>
  )
}

export default ImageGeneratorSettings
