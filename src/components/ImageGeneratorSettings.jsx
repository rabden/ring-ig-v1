import React from 'react';
import StyleChooser from './StyleChooser';
import AspectRatioChooser from './AspectRatioChooser';
import SettingSection from './settings/SettingSection';
import ModelChooser from './settings/ModelChooser';
import ImageCountChooser from './settings/ImageCountChooser';
import StyledScrollArea from './style/StyledScrollArea';
import { qualityOptions } from '@/utils/imageConfigs';
import PromptSection from './settings/PromptSection';
import QualitySettings from './settings/QualitySettings';
import PrivacySettings from './settings/PrivacySettings';
import SeedSettings from './settings/SeedSettings';

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
  modelConfigs,
  imageCount = 1,
  setImageCount,
  isGenerating
}) => {
  const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality] * imageCount;
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCredits = totalCredits >= creditCost;
  const showGuidanceScale = model === 'fluxDev';
  const isNsfwModel = modelConfigs?.[model]?.category === "NSFW";

  const handleModelChange = (newModel) => {
    if ((newModel === 'turbo' || newModel === 'preLar') && quality === 'HD+') {
      setQuality('HD');
    }
    setModel(newModel);
    if (modelConfigs?.[newModel]?.category === "NSFW") {
      setStyle(null);
    }
  };

  const getAvailableQualities = () => {
    if (model === 'turbo' || model === 'preLar') {
      return ["SD", "HD"];
    }
    return Object.keys(qualityOptions);
  };

  const handleAspectRatioChange = (newRatio) => {
    setAspectRatio(newRatio);
    setUseAspectRatio(true);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
      <div className="flex justify-between items-center mb-4">
        {session && (
          <div className="text-sm font-medium">
            Credits: {credits}{bonusCredits > 0 ? ` + B${bonusCredits}` : ''}
            {!hasEnoughCredits && (
              <span className="text-destructive ml-2">
                Need {creditCost} credits
              </span>
            )}
          </div>
        )}
      </div>

      <PromptSection
        prompt={prompt}
        setPrompt={setPrompt}
        handlePromptKeyDown={handlePromptKeyDown}
        generateImage={generateImage}
        hasEnoughCredits={hasEnoughCredits}
        isGenerating={isGenerating}
        model={model}
      />

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

      {!isNsfwModel && (
        <SettingSection label="Style" tooltip="Choose a style to enhance your image generation">
          <div className="border-x border-border/20">
            <StyledScrollArea>
              <StyleChooser 
                style={style} 
                setStyle={setStyle} 
                proMode={proMode} 
                isNsfwMode={isNsfwModel}
              />
            </StyledScrollArea>
          </div>
        </SettingSection>
      )}

      <QualitySettings
        quality={quality}
        setQuality={setQuality}
        availableQualities={getAvailableQualities()}
      />

      <SettingSection label="Aspect Ratio" tooltip="Slide left for portrait, center for square, right for landscape">
        <AspectRatioChooser 
          aspectRatio={aspectRatio} 
          setAspectRatio={handleAspectRatioChange}
          proMode={proMode} 
        />
      </SettingSection>

      <SeedSettings
        seed={seed}
        setSeed={setSeed}
        randomizeSeed={randomizeSeed}
        setRandomizeSeed={setRandomizeSeed}
      />

      <PrivacySettings
        nsfwEnabled={nsfwEnabled}
        setNsfwEnabled={setNsfwEnabled}
      />
    </div>
  );
};

export default React.memo(ImageGeneratorSettings);