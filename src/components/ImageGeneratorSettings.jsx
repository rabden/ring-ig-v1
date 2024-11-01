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
import { ArrowRight, X } from "lucide-react";

const PromptInput = ({ value, onChange, onKeyDown, onGenerate, hasEnoughCredits, onClear }) => {
  return (
    <div className="relative mb-8">
      <div className="relative">
        {/* Fading edges container */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
          
          <textarea
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="A 4D HDR immersive 3D image..."
            className="w-full min-h-[180px] md:min-h-[220px] resize-none bg-transparent text-lg focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none border-y border-border/20 py-8 px-4"
            style={{ 
              caretColor: 'currentColor',
            }}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-4">
          {value.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={onClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            className="rounded-full"
            onClick={onGenerate}
            disabled={!value.length || !hasEnoughCredits}
          >
            Generate
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

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
  steps, setSteps,
  proMode,
  modelConfigs
}) => {
  const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCredits = totalCredits >= creditCost;
  const showGuidanceScale = model === 'fluxDev';
  const isNsfwModel = modelConfigs?.[model]?.category === "NSFW";

  const handleModelChange = (newModel) => {
    if ((newModel === 'turbo' || newModel === 'preLar') && quality === 'HD+') {
      setQuality('HD');
    }
    setModel(newModel);
  };

  const getAvailableQualities = () => {
    if (model === 'turbo' || model === 'preLar') {
      return ["SD", "HD"];
    }
    return Object.keys(qualityOptions);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    
    if (model === 'turbo') {
      const promptLength = e.target.value.length;
      if (promptLength <= 100) {
        setSteps(4);
      } else if (promptLength <= 150) {
        setSteps(8);
      } else if (promptLength <= 200) {
        setSteps(10);
      } else {
        setSteps(12);
      }
    }
  };

  const handleClearPrompt = () => {
    setPrompt('');
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

      <PromptInput
        value={prompt}
        onChange={handlePromptChange}
        onKeyDown={handlePromptKeyDown}
        onGenerate={generateImage}
        hasEnoughCredits={hasEnoughCredits}
        onClear={handleClearPrompt}
      />

      <ModelSection 
        model={model} 
        setModel={handleModelChange}
        nsfwEnabled={nsfwEnabled}
        quality={quality}
        proMode={proMode}
        modelConfigs={modelConfigs}
      />

      {!isNsfwModel && (
        <SettingSection label="Style" tooltip="Choose a style to enhance your image generation">
          <div className="border-x border-border/20">
            <StyleChooser style={style} setStyle={setStyle} proMode={proMode} />
          </div>
        </SettingSection>
      )}

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
        <AspectRatioChooser 
          aspectRatio={aspectRatio} 
          setAspectRatio={setAspectRatio} 
          proMode={proMode} 
        />
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
