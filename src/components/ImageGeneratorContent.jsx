import React from 'react';
import { cn } from '@/lib/utils';
import ImageGeneratorSettings from './ImageGeneratorSettings';
import ImageGallery from './ImageGallery';
import DesktopHeader from './header/DesktopHeader';
import MobileHeader from './header/MobileHeader';
import MobileNavigation from './header/MobileNavigation';
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
  imageGeneratorProps,
  onTogglePrivate,
  profileUserId,
  searchQuery
}) => {
  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Settings Panel */}
      <div className={cn(
        "w-full md:w-[400px] flex-shrink-0 border-r",
        activeView === 'inspiration' && "md:hidden"
      )}>
        <ImageGeneratorSettings {...imageGeneratorProps} showPromptInput={activeView !== 'myImages'} />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Desktop Header */}
        <DesktopHeader
          user={session}
          credits={credits}
          bonusCredits={bonusCredits}
          activeView={activeView}
          setActiveView={setActiveView}
          generatingImages={generatingImages}
          onSearch={onSearch}
          showPrivate={showPrivate}
          onTogglePrivate={onTogglePrivate}
        />

        {/* Mobile Header */}
        <MobileHeader
          user={session}
          credits={credits}
          bonusCredits={bonusCredits}
          activeView={activeView}
          setActiveView={setActiveView}
          generatingImages={generatingImages}
          onSearch={onSearch}
          showPrivate={showPrivate}
          onTogglePrivate={onTogglePrivate}
        />

        {/* Desktop Prompt Box for MyImages */}
        {activeView === 'myImages' && (
          <DesktopMyImagesPromptBox
            prompt={imageGeneratorProps.prompt}
            setPrompt={imageGeneratorProps.setPrompt}
            handlePromptKeyDown={imageGeneratorProps.handlePromptKeyDown}
            isGenerating={imageGeneratorProps.isGenerating}
            isImproving={imageGeneratorProps.isImproving}
            handleGenerate={imageGeneratorProps.generateImage}
            handleImprove={imageGeneratorProps.handleImprove}
            credits={credits}
            bonusCredits={bonusCredits}
            hasEnoughCredits={imageGeneratorProps.hasEnoughCredits}
          />
        )}

        {/* Image Gallery */}
        <div className="flex-1 overflow-y-auto">
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
            searchQuery={searchQuery}
            setActiveTab={setActiveTab}
            showPrivate={showPrivate}
            profileUserId={profileUserId}
          />
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeView={activeView}
          setActiveView={setActiveView}
          generatingImages={generatingImages}
        />
      </div>
    </div>
  );
};

export default ImageGeneratorContent;