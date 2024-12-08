import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Loader } from "lucide-react";
import { toast } from "sonner";
import NewModelChooser from './NewModelChooser';
import ImageGeneratorSettings from '../ImageGeneratorSettings';

const NewInputSettingsBox = ({
  prompt,
  setPrompt,
  handlePromptKeyDown,
  generateImage,
  model,
  setModel,
  settings,
  onSettingsChange,
  session,
  credits,
  bonusCredits,
  nsfwEnabled,
  proMode,
  modelConfigs,
  isImproving,
  onImprovePrompt,
  isGenerating,
}) => {
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    await generateImage();
  };

  const creditCost = settings?.quality ? { "HD": 1, "HD+": 2, "4K": 3 }[settings.quality] : 1;
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCredits = totalCredits >= creditCost;

  return (
    <div className="w-full bg-card rounded-lg border">
      {/* Top Section */}
      <div className="flex gap-6 p-6 border-b">
        {/* Left: Text Area */}
        <div className="flex-1 relative">
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-card to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handlePromptKeyDown}
            placeholder="A 4D HDR immersive 3D image..."
            className="w-full h-[300px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none"
            style={{ caretColor: 'currentColor' }}
          />
        </div>

        {/* Right: Settings Scroll Area */}
        <div className="w-[300px]">
          <ScrollArea className="h-[300px] pr-4">
            <ImageGeneratorSettings
              {...settings}
              onSettingsChange={onSettingsChange}
              hidePromptInput
              hideModelChooser
              hideCredits
            />
          </ScrollArea>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between p-4 bg-muted/40">
        <div className="flex items-center gap-4">
          {/* Credits */}
          <div className="text-sm text-muted-foreground">
            Credits: {credits}{bonusCredits > 0 ? ` + ${bonusCredits}` : ''}
            {!hasEnoughCredits && (
              <span className="text-destructive ml-2">
                Need {creditCost} credits
              </span>
            )}
          </div>

          {/* Model Chooser */}
          <NewModelChooser
            model={model}
            setModel={setModel}
            nsfwEnabled={nsfwEnabled}
            proMode={proMode}
            modelConfigs={modelConfigs}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onImprovePrompt}
            disabled={!prompt?.length || isImproving || isGenerating}
          >
            {isImproving ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Improve
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!prompt?.length || !hasEnoughCredits || isGenerating}
          >
            Generate
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewInputSettingsBox; 