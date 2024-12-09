import React from 'react';
import ImageGallery from './ImageGallery';
import ImageGeneratorSettings from './ImageGeneratorSettings';
import DesktopHeader from './header/DesktopHeader';
import MobileHeader from './header/MobileHeader';
import BottomNavbar from './BottomNavbar';
import DesktopPromptBox from './DesktopPromptBox';

const ImageGeneratorContent = ({
  session,
  credits,
  bonusCredits,
  activeView,
  setActiveView,
  activeTab,
  setActiveTab,
  generatingImages,
  nsfwEnabled,
  showPrivate,
  setShowPrivate,
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  isHeaderVisible,
  handleImageClick,
  handleDownload,
  handleDiscard,
  handleRemix,
  handleViewDetails,
  selectedImage,
  detailsDialogOpen,
  setDetailsDialogOpen,
  fullScreenViewOpen,
  setFullScreenViewOpen,
  imageGeneratorProps
}) => {
  const {
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
    nsfwEnabled: nsfw,
    setNsfwEnabled: setNsfw,
    steps,
    setSteps,
    proMode,
    modelConfigs,
    imageCount,
    setImageCount,
    isPrivate,
    setIsPrivate,
    isGenerating,
    isImproving,
    handleImprove
  } = imageGeneratorProps;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <DesktopHeader
        user={session?.user}
        credits={credits}
        bonusCredits={bonusCredits}
        activeView={activeView}
        setActiveView={setActiveView}
        generatingImages={generatingImages}
        onSearch={onSearch}
        showPrivate={showPrivate}
        onTogglePrivate={setShowPrivate}
      />

      {/* Desktop Prompt Box */}
      {activeView === 'input' && (
        <DesktopPromptBox
          prompt={prompt}
          setPrompt={setPrompt}
          handlePromptKeyDown={handlePromptKeyDown}
          isGenerating={isGenerating}
          isImproving={isImproving}
          handleGenerate={generateImage}
          handleImprove={handleImprove}
          credits={credits}
          bonusCredits={bonusCredits}
        />
      )}

      {/* Mobile Header */}
      <MobileHeader
        user={session?.user}
        credits={credits}
        bonusCredits={bonusCredits}
        isVisible={isHeaderVisible}
      />

      <div className="flex">
        {/* Settings Sidebar - Hidden on desktop for input view */}
        <div className={`${activeView === 'input' ? 'hidden md:hidden' : ''} w-full md:w-[300px] md:flex-shrink-0 border-r`}>
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
            nsfwEnabled={nsfw}
            setNsfwEnabled={setNsfw}
            steps={steps}
            setSteps={setSteps}
            proMode={proMode}
            modelConfigs={modelConfigs}
            imageCount={imageCount}
            setImageCount={setImageCount}
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            isGenerating={isGenerating}
            isImproving={isImproving}
            handleImprove={handleImprove}
            credits={credits}
            bonusCredits={bonusCredits}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 md:pl-4">
          <div className="pt-16 md:pt-20">
            <ImageGallery
              userId={session?.user?.id}
              onImageClick={handleImageClick}
              onDownload={handleDownload}
              onDiscard={handleDiscard}
              onRemix={handleRemix}
              onViewDetails={handleViewDetails}
              activeView={activeView}
              generatingImages={generatingImages}
              nsfwEnabled={nsfwEnabled}
              activeFilters={activeFilters}
              searchQuery={onSearch}
              setActiveTab={setActiveTab}
              showPrivate={showPrivate}
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <BottomNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        session={session}
        credits={credits}
        bonusCredits={bonusCredits}
        activeView={activeView}
        setActiveView={setActiveView}
        generatingImages={generatingImages}
      />
    </div>
  );
};

export default ImageGeneratorContent;