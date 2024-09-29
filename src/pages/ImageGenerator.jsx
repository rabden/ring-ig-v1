import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { modelConfigs } from '@/utils/modelConfigs'
import Masonry from 'react-masonry-css'
import BottomNavbar from '@/components/BottomNavbar'

const aspectRatios = {
  "1:1": { width: 1024, height: 1024 },
  "4:3": { width: 1024, height: 768 },
  "3:4": { width: 768, height: 1024 },
  "16:9": { width: 1024, height: 576 },
  "9:16": { width: 576, height: 1024 },
}

const qualityOptions = {
  "SD": 512,
  "HD": 1024,
  "HD+": 1536,
  "4K": 2048,
}

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState(0)
  const [randomizeSeed, setRandomizeSeed] = useState(true)
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)
  const [steps, setSteps] = useState(modelConfigs.flux.defaultStep)
  const [model, setModel] = useState('flux')
  const [generatedImages, setGeneratedImages] = useState([])
  const [activeTab, setActiveTab] = useState('images')
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [useAspectRatio, setUseAspectRatio] = useState(true)
  const [quality, setQuality] = useState("HD")

  useEffect(() => {
    updateDimensions()
  }, [aspectRatio, quality, useAspectRatio])

  const updateDimensions = () => {
    const maxSize = qualityOptions[quality]
    let newWidth, newHeight

    if (useAspectRatio) {
      const ratio = aspectRatios[aspectRatio]
      if (ratio.width > ratio.height) {
        newWidth = maxSize
        newHeight = Math.round((maxSize / ratio.width) * ratio.height)
      } else {
        newHeight = maxSize
        newWidth = Math.round((maxSize / ratio.height) * ratio.width)
      }
    } else {
      newWidth = Math.min(width, maxSize)
      newHeight = Math.min(height, maxSize)
    }

    setWidth(Math.floor(newWidth / 8) * 8)
    setHeight(Math.floor(newHeight / 8) * 8)
  }

  const generateImage = async () => {
    if (!prompt) {
      alert('Please enter a prompt')
      return
    }

    const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed
    setSeed(actualSeed)

    const newImage = {
      id: Date.now(),
      prompt,
      seed: actualSeed,
      width,
      height,
      steps,
      model,
      loading: true,
    }

    setGeneratedImages(prev => [newImage, ...prev])

    const data = {
      inputs: prompt,
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
      const result = await response.blob()
      const imageUrl = URL.createObjectURL(result)

      setGeneratedImages(prev =>
        prev.map(img =>
          img.id === newImage.id ? { ...img, loading: false, imageUrl } : img
        )
      )
    } catch (error) {
      console.error('Error generating image:', error)
      setGeneratedImages(prev =>
        prev.map(img =>
          img.id === newImage.id ? { ...img, loading: false, error: true } : img
        )
      )
    }
  }

  const handleModelChange = (value) => {
    setModel(value)
    setSteps(modelConfigs[value].defaultStep)
  }

  const handlePromptKeyDown = (e) => {
    if (e.key === 'Enter') {
      generateImage()
    }
  }

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        <h1 className="text-3xl font-bold mb-6">AI Image Generator</h1>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto"
          columnClassName="bg-clip-padding px-2"
        >
          {generatedImages.map((image) => (
            <div key={image.id} className="mb-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                  {image.loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : image.error ? (
                    <div className="absolute inset-0 flex items-center justify-center text-destructive">
                      Error generating image
                    </div>
                  ) : (
                    <img 
                      src={image.imageUrl} 
                      alt={image.prompt} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </Masonry>
      </div>
      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen`}>
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promptInput">Prompt</Label>
            <Input
              id="promptInput"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder="Enter your prompt here"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modelSelect">Model</Label>
            <Select value={model} onValueChange={handleModelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(modelConfigs).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(qualityOptions).map((q) => (
                  <SelectItem key={q} value={q}>{q}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Use Aspect Ratio</Label>
              <Switch
                checked={useAspectRatio}
                onCheckedChange={setUseAspectRatio}
              />
            </div>
            {useAspectRatio ? (
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatios).map((ratio) => (
                    <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
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
          <Button onClick={generateImage} className="w-full">
            Generate Image
          </Button>
        </div>
      </div>
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default ImageGenerator