import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import PromptInput from './prompt/PromptInput';
import ModelSelector from './settings/ModelSelector';
import QualitySelector from './settings/QualitySelector';
import AspectRatioSelector from './settings/AspectRatioSelector';
import ImageCountSelector from './settings/ImageCountSelector';
import SeedInput from './settings/SeedInput';

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
  session,
  credits,
  bonusCredits,
  nsfwEnabled,
  setNsfwEnabled,
  steps,
  setSteps,
  proMode,
  modelConfigs,
  imageCount,
  setImageCount,
  isGenerating,
  isImproving,
  handleImprove,
  hasEnoughCredits,
  showPromptInput = true
}) => {
  return (
    <ScrollArea className="h-full px-6 py-6">
      <div className="space-y-6">
        {/* Show prompt controls only on mobile */}
        {showPromptInput && (
          <div className="md:hidden space-y-4">
            <div className="space-y-2">
              <PromptInput
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handlePromptKeyDown}
                onGenerate={generateImage}
                hasEnoughCredits={hasEnoughCredits}
                onClear={() => setPrompt('')}
                onImprove={handleImprove}
                isImproving={isImproving}
              />
              
              <div className="flex items-center gap-2">
                <div className="text-sm">
                  <span className="font-medium">{credits}</span>
                  <span className="text-muted-foreground"> credits</span>
                  {bonusCredits > 0 && (
                    <span className="text-muted-foreground">
                      {" + "}
                      <span className="text-primary font-medium">{bonusCredits}</span>
                      {" bonus"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Model Settings */}
        <div className="space-y-4">
          <ModelSelector
            model={model}
            setModel={setModel}
            modelConfigs={modelConfigs}
            proMode={proMode}
          />

          <QualitySelector
            quality={quality}
            setQuality={setQuality}
            modelConfig={modelConfigs?.[model]}
          />

          <AspectRatioSelector
            useAspectRatio={useAspectRatio}
            setUseAspectRatio={setUseAspectRatio}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            modelConfig={modelConfigs?.[model]}
          />

          <ImageCountSelector
            imageCount={imageCount}
            setImageCount={setImageCount}
            proMode={proMode}
          />

          <SeedInput
            seed={seed}
            setSeed={setSeed}
            randomizeSeed={randomizeSeed}
            setRandomizeSeed={setRandomizeSeed}
          />

          {session && (
            <div className="flex items-center justify-between">
              <Label htmlFor="nsfw" className="text-sm font-medium">
                NSFW Content
              </Label>
              <Switch
                id="nsfw"
                checked={nsfwEnabled}
                onCheckedChange={setNsfwEnabled}
              />
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ImageGeneratorSettings;