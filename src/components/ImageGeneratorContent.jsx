import React from 'react';
import ImageGallery from './ImageGallery';
import BottomNavbar from './BottomNavbar';
import MobileNotificationsMenu from './MobileNotificationsMenu';
import MobileProfileMenu from './MobileProfileMenu';
import ImageDetailsDialog from './ImageDetailsDialog';
import FullScreenImageView from './FullScreenImageView';
import DesktopHeader from './header/DesktopHeader';
import MobileHeader from './header/MobileHeader';
import ImageGeneratorSettings from './ImageGeneratorSettings';
import NewInputSettingsBox from './settings/NewInputSettingsBox';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';

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
  setStyle,
  imageGeneratorProps
}) => {
  const { isImproving, improveCurrentPrompt } = usePromptImprovement();

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Desktop Header */}
        {session && (
          <>
            <div className="hidden md:block w-full">
              <DesktopHeader
                user={session.user}
                credits={credits}
                bonusCredits={bonusCredits}
                activeView={activeView}
                setActiveView={setActiveView}
                generatingImages={generatingImages}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                onRemoveFilter={onRemoveFilter}
                onSearch={onSearch}
                nsfwEnabled={nsfwEnabled}
                showPrivate={showPrivate}
                onTogglePrivate={() => setShowPrivate(!showPrivate)}
              />
            </div>
            {/* Mobile Header */}
            <div className="md:hidden">
              <MobileHeader
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                onRemoveFilter={onRemoveFilter}
                onSearch={onSearch}
                isVisible={isHeaderVisible}
                nsfwEnabled={nsfwEnabled}
                showPrivate={showPrivate}
                onTogglePrivate={() => setShowPrivate(!showPrivate)}
                activeView={activeView}
              />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-grow p-2 md:p-6">
          {/* Desktop Input Settings Box */}
          <div className="hidden md:block mb-6">
            <NewInputSettingsBox
              prompt={imageGeneratorProps.prompt}
              setPrompt={imageGeneratorProps.setPrompt}
              handlePromptKeyDown={imageGeneratorProps.handlePromptKeyDown}
              generateImage={imageGeneratorProps.generateImage}
              model={imageGeneratorProps.model}
              setModel={imageGeneratorProps.setModel}
              settings={imageGeneratorProps}
              onSettingsChange={(key, value) => {
                if (typeof imageGeneratorProps[`set${key.charAt(0).toUpperCase() + key.slice(1)}`] === 'function') {
                  imageGeneratorProps[`set${key.charAt(0).toUpperCase() + key.slice(1)}`](value);
                }
              }}
              session={session}
              credits={credits}
              bonusCredits={bonusCredits}
              nsfwEnabled={nsfwEnabled}
              proMode={imageGeneratorProps.proMode}
              modelConfigs={imageGeneratorProps.modelConfigs}
              isImproving={isImproving}
              onImprovePrompt={() => improveCurrentPrompt(imageGeneratorProps.prompt, imageGeneratorProps.setPrompt)}
              isGenerating={generatingImages.length > 0}
            />
          </div>

          {/* Mobile Input Settings */}
          <div className={`md:hidden ${activeTab === 'input' ? 'block' : 'hidden'}`}>
            <ImageGeneratorSettings {...imageGeneratorProps} />
          </div>

          {/* Image Gallery */}
          <div className={`${activeTab === 'images' ? 'block' : 'hidden md:block'}`}>
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
              modelConfigs={imageGeneratorProps.modelConfigs}
              activeFilters={activeFilters}
              searchQuery={imageGeneratorProps.searchQuery}
              setActiveTab={setActiveTab}
              setStyle={setStyle}
              showPrivate={showPrivate}
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation and Menus */}
      <MobileNotificationsMenu activeTab={activeTab} />
      <MobileProfileMenu 
        user={session?.user}
        credits={credits}
        bonusCredits={bonusCredits}
        activeTab={activeTab}
      />
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
      
      {/* Dialogs */}
      <ImageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        image={selectedImage}
      />
      <FullScreenImageView
        image={selectedImage}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onDownload={handleDownload}
        onDiscard={handleDiscard}
        onRemix={handleRemix}
        isOwner={selectedImage?.user_id === session?.user?.id}
        setStyle={setStyle}
        setActiveTab={setActiveTab}
      />
    </>
  );
};

export default ImageGeneratorContent;