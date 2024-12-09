import React from 'react';
import { cn } from "@/lib/utils";
import DesktopHeader from './header/DesktopHeader';
import MobileHeader from './header/MobileHeader';
import MobileNavigation from './navigation/MobileNavigation';
import ImageGallery from './ImageGallery';
import ImageGeneratorSettings from './ImageGeneratorSettings';
import DesktopPromptBox from './DesktopPromptBox';
import DesktopMyImagesPromptBox from './myimages/DesktopMyImagesPromptBox';

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
  const isMyImagesView = activeView === 'myImages';
  const showSettings = !isMyImagesView || activeTab === 'input';

  return (
    <div className="min-h-screen bg-background">
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
      <MobileHeader
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

      {/* Desktop Prompt Box for myImages view */}
      {isMyImagesView && activeTab === 'input' && (
        <DesktopMyImagesPromptBox
          prompt={imageGeneratorProps.prompt}
          setPrompt={imageGeneratorProps.setPrompt}
          handlePromptKeyDown={imageGeneratorProps.handlePromptKeyDown}
          isGenerating={generatingImages.length > 0}
          isImproving={imageGeneratorProps.isImproving}
          handleGenerate={imageGeneratorProps.generateImage}
          handleImprove={imageGeneratorProps.handleImprove}
          credits={credits}
          bonusCredits={bonusCredits}
          hasEnoughCredits={imageGeneratorProps.hasEnoughCredits}
        />
      )}

      {/* Desktop Prompt Box for other views */}
      {!isMyImagesView && (
        <DesktopPromptBox
          prompt={imageGeneratorProps.prompt}
          setPrompt={imageGeneratorProps.setPrompt}
          handlePromptKeyDown={imageGeneratorProps.handlePromptKeyDown}
          isGenerating={generatingImages.length > 0}
          isImproving={false}
          handleGenerate={imageGeneratorProps.generateImage}
          handleImprove={() => {}}
          credits={credits}
          bonusCredits={bonusCredits}
        />
      )}

      <div className="flex">
        {/* Settings Panel */}
        {showSettings && (
          <div className={cn(
            "hidden md:block w-[300px] shrink-0 border-r h-[calc(100vh-48px)] sticky top-12",
            isHeaderVisible ? "top-12" : "top-0"
          )}>
            <ImageGeneratorSettings
              {...imageGeneratorProps}
              isGenerating={generatingImages.length > 0}
              generatingImages={generatingImages}
              activeView={activeView}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              nsfwEnabled={nsfwEnabled}
              showPromptInput={!isMyImagesView}
            />
          </div>
        )}

        {/* Main Content */}
        <div className={cn(
          "flex-1 px-0 pb-16 md:pb-0",
          showSettings ? "md:pl-0" : "md:pl-0"
        )}>
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

      <MobileNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeView={activeView}
        setActiveView={setActiveView}
      />
    </div>
  );
};

export default ImageGeneratorContent;