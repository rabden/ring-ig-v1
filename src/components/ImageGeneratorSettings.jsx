import React from 'react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { qualityOptions } from '@/utils/imageConfigs';
import StyleChooser from './StyleChooser';
import AspectRatioChooser from './AspectRatioChooser';
import SettingSection from './settings/SettingSection';
import ModelSection from './settings/ModelSection';
import NSFWToggle from './settings/NSFWToggle';
import CustomPromptBox from './CustomPromptBox';

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
  session,
  credits,
  bonusCredits,
  nsfwEnabled, setNsfwEnabled,
  style, setStyle,
  steps, setSteps,
}) => {
  const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCredits = totalCredits >= creditCost;

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    if (model === 'turbo') {
      const promptLength = e.target.value.length;
      setSteps(promptLength <= 100 ? 4 : promptLength <= 150 ? 8 : promptLength <= 200 ? 10 : 12);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
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
        <CustomPromptBox
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handlePromptKeyDown}
          onGenerate={generateImage}
        />
      </SettingSection>

      <ModelSection 
        model={model} 
        setModel={setModel}
        nsfwEnabled={nsfwEnabled}
      />

      <SettingSection label="Quality" tooltip="Higher quality settings produce more detailed images but require more credits.">
        <Tabs value={quality} onValueChange={setQuality} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(qualityOptions).length}, 1fr)` }}>
            {Object.keys(qualityOptions).map((q) => (
              <TabsTrigger key={q} value={q} className="text-sm">{q}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </SettingSection>

      <SettingSection label="Style" tooltip="Choose a style to enhance your image generation">
        <StyleChooser style={style} setStyle={setStyle} />
      </SettingSection>

      <SettingSection label="Aspect Ratio" tooltip="Choose the dimensions of your generated image">
        <AspectRatioChooser aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
      </SettingSection>

      <SettingSection label="Seed" tooltip="A seed is a number that initializes the random generation process. Using the same seed with the same settings will produce similar results.">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value))}
            disabled={randomizeSeed}
            className="font-mono"
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

      <NSFWToggle enabled={nsfwEnabled} onToggle={setNsfwEnabled} />
    </div>
  );
};

export default ImageGeneratorSettings;