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
  steps, setSteps,
  proMode,
  modelConfigs,
  imageCount = 1,
  setImageCount,
  isPrivate,
  setIsPrivate,
  hidePromptOnDesktop = false,
  updateCredits
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

    await improveCurrentPrompt(prompt, (improvedPrompt) => {
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
    <div className="space-y-4 pb-20 md:pb-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
      <div className={hidePromptOnDesktop ? 'md:hidden' : ''}>
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
        <div className="flex justify-center w-full">
          <CreditCounter credits={credits} bonusCredits={bonusCredits} />
        </div>
      )}

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
    </div>
  );
};

export default ImageGeneratorSettings;
