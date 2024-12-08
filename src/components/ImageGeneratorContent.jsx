import React from 'react';
import ImageGeneratorSettings from './ImageGeneratorSettings';
import ImageGallery from './ImageGallery';
import BottomNavbar from './BottomNavbar';
import MobileNotificationsMenu from './MobileNotificationsMenu';
import MobileProfileMenu from './MobileProfileMenu';
import ImageDetailsDialog from './ImageDetailsDialog';
import FullScreenImageView from './FullScreenImageView';
import DesktopHeader from './header/DesktopHeader';
import MobileHeader from './header/MobileHeader';

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
  const isInspiration = activeView === 'inspiration';
  
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
        <div className={`flex-grow p-2 md:p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} ${isInspiration ? '' : 'md:pr-[350px]'} pb-20 md:pb-6`}>
          {session && (
            <>
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
            </>
          )}

          <div className="md:mt-12 mt-12">
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
              showPrivate={showPrivate}
            />
          </div>
        </div>

        <div 
          className={`w-full md:w-[350px] bg-card text-card-foreground p-4 md:p-6 overflow-y-auto 
            ${!isInspiration ? 'md:fixed md:right-0 md:top-12 md:bottom-0' : ''} 
            ${activeTab === 'input' ? 'block' : (isInspiration ? 'hidden' : 'hidden md:block')} 
            max-h-[calc(100vh-56px)] md:max-h-[calc(100vh-3rem)] relative`}
        >
          <ImageGeneratorSettings {...imageGeneratorProps} />
        </div>
      </div>

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
        setActiveTab={setActiveTab}
      />
    </>
  );
};

export default ImageGeneratorContent;