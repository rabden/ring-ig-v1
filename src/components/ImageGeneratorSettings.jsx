import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import AspectRatioChooser from './AspectRatioChooser';
import SettingSection from './settings/SettingSection';
import ModelChooser from './settings/ModelChooser';
import ImageCountChooser from './settings/ImageCountChooser';
import PromptInput from './prompt/PromptInput';
import { qualityOptions } from '@/utils/imageConfigs';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';
import { toast } from 'sonner';
import CreditCounter from '@/components/ui/credit-counter';
import { useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

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
  credits = 0,
  bonusCredits = 0,
  nsfwEnabled, setNsfwEnabled,
  proMode,
  modelConfigs,
  imageCount = 1,
  setImageCount,
  isPrivate,
  setIsPrivate,
  hidePromptOnDesktop = false,
  updateCredits,
  className
}) => {
  const location = useLocation();
  const isGenerateTab = location.hash === '#imagegenerate';
  const userId = session?.user?.id;
  const { isImproving, improveCurrentPrompt } = usePromptImprovement(userId);
  const creditCost = { "HD": 1, "HD+": 2, "4K": 3 }[quality] * imageCount;
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCredits = totalCredits >= creditCost;
  const hasEnoughCreditsForImprovement = totalCredits >= 1;

  const handleModelChange = (newModel) => {
    if (newModel === 'turbo' && (quality === 'HD+' || quality === '4K')) {
      setQuality('HD');
    }
    setModel(newModel);
  };

  const getAvailableQualities = () => {
    const modelConfig = modelConfigs[model];
    // If qualityLimits not specified, allow all qualities
    if (!modelConfig?.qualityLimits) {
      return Object.keys(qualityOptions);
    }
    
    // If specified, only allow those qualities
    return modelConfig.qualityLimits;
  };

  const handleClearPrompt = () => {
    setPrompt('');
  };

  const handleImprovePrompt = async () => {
    if (!prompt?.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!hasEnoughCreditsForImprovement) {
      toast.error('Not enough credits for prompt improvement');
      return;
    }

    await improveCurrentPrompt(prompt, model, modelConfigs, (improvedPrompt) => {
      setPrompt(improvedPrompt);
    });
  };

  const handleGenerate = async () => {
    if (!prompt?.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!hasEnoughCredits) {
      toast.error('Not enough credits');
      return;
    }

    await generateImage();
  };

  return (
    <div className={cn(
      "space-y-4 pb-20 md:pb-0 overflow-y-auto",
      "scrollbar-thin scrollbar-thumb-muted-foreground/20",
      "scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30",
      "transition-colors duration-200",
      className
    )}>
      <div className={cn(
        hidePromptOnDesktop && 'md:hidden',
        "transition-all duration-200"
      )}>
        <PromptInput
          prompt={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handlePromptKeyDown}
          onSubmit={handleGenerate}
          hasEnoughCredits={hasEnoughCredits}
          onClear={handleClearPrompt}
          onImprove={handleImprovePrompt}
          isImproving={isImproving}
          userId={session?.user?.id}
          credits={credits}
          bonusCredits={bonusCredits}
        />
      </div>

      {isGenerateTab && (
        <div className={cn(
          "flex justify-center w-full",
          "animate-in fade-in-50 duration-300"
        )}>
          <CreditCounter credits={credits} bonusCredits={bonusCredits} />
        </div>
      )}

      <div className="space-y-6">
        <ModelChooser
          model={model}
          setModel={handleModelChange}
          nsfwEnabled={nsfwEnabled}
          proMode={proMode}
          modelConfigs={modelConfigs}
        />

        <ImageCountChooser
          count={imageCount}
          setCount={setImageCount}
        />

        <SettingSection 
          label="Quality" 
          tooltip="Higher quality settings produce more detailed images but require more credits."
        >
          <Tabs 
            value={quality} 
            onValueChange={setQuality}
            className="w-full"
          >
            <TabsList 
              className={cn(
                "grid p-1 h-9",
                "bg-muted/40 hover:bg-muted/60",
                "transition-colors duration-200"
              )} 
              style={{ 
                gridTemplateColumns: `repeat(${getAvailableQualities().length}, 1fr)` 
              }}
            >
              {getAvailableQualities().map((q) => (
                <TabsTrigger 
                  key={q} 
                  value={q}
                  className={cn(
                    "text-sm font-medium",
                    "data-[state=active]:bg-background",
                    "data-[state=active]:text-foreground",
                    "data-[state=active]:shadow-sm",
                    "transition-all duration-200"
                  )}
                >
                  {q}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </SettingSection>

        <SettingSection 
          label="Aspect Ratio" 
          tooltip="Slide left for portrait, center for square, right for landscape"
        >
          <AspectRatioChooser 
            aspectRatio={aspectRatio} 
            setAspectRatio={setAspectRatio}
            proMode={proMode} 
          />
        </SettingSection>

        <SettingSection 
          label="Seed" 
          tooltip="A seed is a number that initializes the random generation process. Using the same seed with the same settings will produce the same image."
        >
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value))}
              disabled={randomizeSeed}
              className={cn(
                "transition-colors duration-200",
                randomizeSeed && "opacity-50"
              )}
            />
            <div className="flex items-center gap-2">
              <Switch
                id="randomizeSeed"
                checked={randomizeSeed}
                onCheckedChange={setRandomizeSeed}
              />
              <Label 
                htmlFor="randomizeSeed"
                className={cn(
                  "text-sm text-muted-foreground",
                  "transition-colors duration-200",
                  "hover:text-foreground"
                )}
              >
                Random
              </Label>
            </div>
          </div>
        </SettingSection>
      </div>
    </div>
  );
};

export default ImageGeneratorSettings;
