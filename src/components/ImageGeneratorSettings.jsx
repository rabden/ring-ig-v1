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
import { ArrowRight, X } from 'lucide-react';
import { modelConfigs } from '@/utils/modelConfigs';

const PromptInput = ({ value, onChange, onKeyDown, onGenerate }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef(null);
  const [showClear, setShowClear] = React.useState(false);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 300) + 'px';
      setShowClear(scrollHeight > 100);
    }
  }, [value]);

  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  const showButton = isFocused || value.length > 0;

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Enter your prompt here"
        className="w-full min-h-[40px] max-h-[300px] resize-none overflow-y-auto bg-background rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 pr-10 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
        rows={1}
      />
      <div className="absolute right-3 bottom-3 flex flex-col gap-2 items-center">
        {showClear && (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {showButton && (
          <Button
            size="icon"
            className="h-7 w-7"
            onClick={onGenerate}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
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
}) => {
  const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCredits = totalCredits >= creditCost;
  const showGuidanceScale = model === 'fluxDev';
  const isNsfwModel = modelConfigs[model]?.category === "NSFW";

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
    
    // Update steps based on prompt length for turbo model
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
        <PromptInput
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handlePromptKeyDown}
          onGenerate={generateImage}
        />
      </SettingSection>

      <ModelSection 
        model={model} 
        setModel={handleModelChange}
        nsfwEnabled={nsfwEnabled} 
        quality={quality}
        proMode={proMode}
      />

      {!isNsfwModel && (
        <SettingSection label="Style" tooltip="Choose a style to enhance your image generation">
          <StyleChooser style={style} setStyle={setStyle} proMode={proMode} />
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
