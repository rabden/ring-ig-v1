import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import { useUserCredits } from '@/hooks/useUserCredits'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/supabase'
import { modelConfigs } from '@/utils/modelConfigs'

const aspectRatios = {
  "1:1": { width: 1024, height: 1024 },
  "4:3": { width: 1024, height: 768 },
  "3:4": { width: 768, height: 1024 },
  "16:9": { width: 1024, height: 576 },
  "9:16": { width: 576, height: 1024 },
  "3:2": { width: 1024, height: 683 },
  "2:3": { width: 683, height: 1024 },
  "5:4": { width: 1024, height: 819 },
  "4:5": { width: 819, height: 1024 },
  "21:9": { width: 1024, height: 439 },
  "9:21": { width: 439, height: 1024 },
  "1.91:1": { width: 1024, height: 536 },
  "1:1.91": { width: 536, height: 1024 },
  "1:2": { width: 512, height: 1024 },
  "2:1": { width: 1024, height: 512 },
}

const qualityOptions = {
  "SD": 512,
  "HD": 1024,
  "HD+": 1536,
  "4K": 2048,
}

const ImageGeneratorSettings = () => {
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState(0)
  const [randomizeSeed, setRandomizeSeed] = useState(true)
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)
  const [steps, setSteps] = useState(modelConfigs.flux.defaultStep)
  const [model, setModel] = useState('flux')
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [useAspectRatio, setUseAspectRatio] = useState(true)
  const [quality, setQuality] = useState("HD")
  const { session } = useSupabaseAuth()
  const { credits, updateCredits } = useUserCredits(session?.user?.id)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (useAspectRatio) {
      const { width: w, height: h } = aspectRatios[aspectRatio]
      const scaleFactor = qualityOptions[quality] / Math.max(w, h)
      setWidth(Math.round(w * scaleFactor))
      setHeight(Math.round(h * scaleFactor))
    }
  }, [aspectRatio, useAspectRatio, quality])

  const generateImage = async () => {
    if (!session) {
      console.log('User not authenticated')
      return
    }

    if (!prompt) {
      toast.error('Please enter a prompt')
      return
    }

    const creditCost = {
      "SD": 1,
      "HD": 2,
      "HD+": 3,
      "4K": 4
    }[quality]

    if (credits < creditCost) {
      toast.error(`Insufficient credits. You need ${creditCost} credits for ${quality} quality.`)
      return
    }

    const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed
    setSeed(actualSeed)

    let modifiedPrompt = prompt;

    if (modelConfigs[model].promptSuffix) {
      modifiedPrompt += modelConfigs[model].promptSuffix;
    }

    setIsGenerating(true)

    const data = {
      inputs: modifiedPrompt,
      parameters: {
        seed: actualSeed,
        width,
        height,
        num_inference_steps: steps
      }
    }

    try {
      const response = await fetch(
        modelConfigs[model].apiUrl,
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      )
      const imageBlob = await response.blob()

      await updateCredits(quality)

      const filePath = `${session.user.id}/${Date.now()}.png`
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, imageBlob)
      if (uploadError) throw uploadError

      const { data: publicURL } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath)

      const { error: insertError } = await supabase
        .from('user_images')
        .insert({
          user_id: session.user.id,
          storage_path: filePath,
          prompt: modifiedPrompt,
          seed: actualSeed,
          width,
          height,
          steps,
          model,
          quality,
          aspect_ratio: useAspectRatio ? aspectRatio : `${width}:${height}`,
        })
      if (insertError) throw insertError

      toast.success(`Image generated successfully. ${creditCost} credits used.`)
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="promptInput">Prompt</Label>
        <Textarea
          id="promptInput"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
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
          onClick={() => setModel(model === 'flux' ? 'otherModel' : 'flux')}
        >
          {modelConfigs[model].name}
          <span className="ml-2 opacity-50">{modelConfigs[model].category}</span>
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
      <div className="space-y-2">
        <Label>Inference Steps</Label>
        <Tabs value={steps.toString()} onValueChange={(value) => setSteps(parseInt(value))}>
          <TabsList className="grid grid-cols-5 w-full">
            {modelConfigs[model].inferenceSteps.map((step) => (
              <TabsTrigger key={step} value={step.toString()}>
                {step}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

export default ImageGeneratorSettings
