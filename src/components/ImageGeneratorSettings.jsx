import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { qualityOptions } from '@/utils/imageConfigs';
import StyleChooser from './StyleChooser';
import AspectRatioChooser from './AspectRatioChooser';
import SettingSection from './settings/SettingSection';
import ModelSection from './settings/ModelSection';
import GuidanceScaleSection from './settings/GuidanceScaleSection';

const ImageGeneratorSettings = ({
  prompt, setPrompt,
  handlePromptKeyDown,
  generateImage,
  model, setModel,
  seed, setSeed,
  randomizeSeed, setRandomizeSeed,
  quality, setQuality,
  useAspectRatio, setUseAspectRatio,
  aspectRatio, setAspectRatio,
  width, setWidth,
  height, setHeight,
  session,
  credits,
  bonusCredits,
  nsfwEnabled, setNsfwEnabled,
  style, setStyle,
  guidanceScale = 3.5,
  setGuidanceScale
}) => {
  const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCredits = totalCredits >= creditCost;
  const showGuidanceScale = model === 'fluxDev';

  // Get available quality options based on model
  const getAvailableQualities = () => {
    if (model === 'turbo') {
      return ["SD", "HD"];
    }
    return Object.keys(qualityOptions);
  };

  // Handle model change
  const handleModelChange = (newModel) => {
    setModel(newModel);
    if (newModel === 'turbo' && quality === 'HD+') {
      setQuality('HD');
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Settings</h2>
        {session && (
          <div className="text-sm font-medium">
            Credits: {credits}{bonusCredits > 0 ? ` + B${bonusCredits}` : ''}
            {!hasEnoughCredits && (
              <span className="text-destructive ml-2">
                Need {creditCost} credits for {quality}
              </span>
            )}
          </div>
        )}
      </div>

      <SettingSection label="Prompt" tooltip="Enter a description of the image you want to generate. Be as specific as possible for best results.">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handlePromptKeyDown}
          placeholder="Enter your prompt here"
          className="w-full min-h-[40px] max-h-[300px] resize-none overflow-y-auto bg-background rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
          rows={1}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 300) + 'px';
          }}
        />
      </SettingSection>

      <Button 
        onClick={generateImage} 
        className="w-full" 
        disabled={!session || !hasEnoughCredits}
      >
        {!session ? 'Sign in to generate' : !hasEnoughCredits ? `Need ${creditCost} credits for ${quality}` : 'Generate Image'}
      </Button>

      <ModelSection 
        model={model} 
        setModel={handleModelChange}
        nsfwEnabled={nsfwEnabled} 
        quality={quality}
      />

      {showGuidanceScale && (
        <GuidanceScaleSection guidanceScale={guidanceScale} setGuidanceScale={setGuidanceScale} />
      )}

      <SettingSection label="Style" tooltip="Choose a style to enhance your image generation">
        <StyleChooser style={style} setStyle={setStyle} />
      </SettingSection>

      <SettingSection label="Quality" tooltip="Higher quality settings produce more detailed images but require more credits.">
        <Tabs value={quality} onValueChange={setQuality}>
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${getAvailableQualities().length}, 1fr)` }}>
            {getAvailableQualities().map((q) => (
              <TabsTrigger key={q} value={q}>{q}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </SettingSection>

      <SettingSection label="Aspect Ratio" tooltip="Slide left for portrait, center for square, right for landscape">
        <AspectRatioChooser aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
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

      <div className="flex items-center justify-between space-x-4">
        <Label htmlFor="nsfwToggle" className="text-sm font-medium">Enable NSFW Content</Label>
        <Switch
          id="nsfwToggle"
          checked={nsfwEnabled}
          onCheckedChange={setNsfwEnabled}
        />
      </div>
    </div>
  );
};

export default ImageGeneratorSettings;