import React from 'react';
import ImageGeneratorSettings from './ImageGeneratorSettings';
import GeneratingImagesDropdown from './GeneratingImagesDropdown';
import AuthOverlay from './AuthOverlay';

const ImageGeneratorContainer = ({ 
  session, 
  credits, 
  bonusCredits, 
  generatingImages, 
  completedImages,
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
  width, 
  setWidth,
  height, 
  setHeight,
  steps, 
  setSteps,
  proMode,
  modelConfigs,
  isPrivate,
  setIsPrivate,
  imageCount,
  setImageCount
}) => {
  return (
    <div className="w-full md:w-[350px] bg-card text-card-foreground p-4 md:p-6 overflow-y-auto md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative">
      {!session && (
        <div className="absolute inset-0 z-10">
          <AuthOverlay />
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <GeneratingImagesDropdown 
          generatingImages={generatingImages} 
          completedImages={completedImages}
        />
      </div>

      <ImageGeneratorSettings
        prompt={prompt}
        setPrompt={setPrompt}
        handlePromptKeyDown={handlePromptKeyDown}
        generateImage={generateImage}
        model={model}
        setModel={setModel}
        seed={seed}
        setSeed={setSeed}
        randomizeSeed={randomizeSeed}
        setRandomizeSeed={setRandomizeSeed}
        quality={quality}
        setQuality={setQuality}
        useAspectRatio={useAspectRatio}
        setUseAspectRatio={setUseAspectRatio}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        width={width}
        setWidth={setWidth}
        height={height}
        setHeight={setHeight}
        steps={steps}
        setSteps={setSteps}
        session={session}
        credits={credits}
        bonusCredits={bonusCredits}
        proMode={proMode}
        modelConfigs={modelConfigs}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
        imageCount={imageCount}
        setImageCount={setImageCount}
      />
    </div>
  );
};

export default ImageGeneratorContainer;