import React, { useState, useEffect } from 'react';
import ImageGeneratorSettings from './ImageGeneratorSettings';
import ImageGallery from './ImageGallery';
import BottomNavbar from './BottomNavbar';
import MobileNotificationsMenu from './MobileNotificationsMenu';
import MobileProfileMenu from './MobileProfileMenu';
import ImageDetailsDialog from './ImageDetailsDialog';
import FullScreenImageView from './FullScreenImageView';
import DesktopHeader from './header/DesktopHeader';
import MobileHeader from './header/MobileHeader';
import DesktopPromptBox from './prompt/DesktopPromptBox';
import FixedPromptBox from './prompt/FixedPromptBox';
import CreditCounter from '@/components/ui/credit-counter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const shouldShowSettings = !isInspiration || (activeTab === 'input' && window.innerWidth < 768);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [isPromptHidden, setIsPromptHidden] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSidebarMounted, setIsSidebarMounted] = useState(false);

  // Handle sidebar visibility with transitions
  useEffect(() => {
    if (shouldShowSettings && isPromptExpanded && !isInspiration) {
      // Mount first
      setIsSidebarMounted(true);
      // Then show after a tiny delay to trigger transition
      requestAnimationFrame(() => {
        setIsSidebarVisible(true);
      });
    } else {
      // Hide first
      setIsSidebarVisible(false);
      // Then unmount after transition
      const timer = setTimeout(() => {
        setIsSidebarMounted(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [shouldShowSettings, isPromptExpanded, isInspiration]);

  const handleFixedPromptClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Wait for scroll to complete before expanding
    setTimeout(() => {
      setIsPromptExpanded(true);
    }, 300);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground image-generator-content">
        <div className={cn(
          "flex-grow p-2 md:p-6 overflow-y-auto",
          "transition-all duration-300 ease-in-out transform-gpu will-change-[padding,width]",
          activeTab === 'images' ? 'block' : 'hidden md:block',
          isSidebarVisible ? 'md:pr-[350px]' : 'md:pr-6',
          "pb-20 md:pb-6"
        )}>
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
              
              {!isInspiration && (
                <>
                  <DesktopPromptBox
                    prompt={imageGeneratorProps.prompt}
                    onChange={(e) => imageGeneratorProps.setPrompt(e.target.value)}
                    onKeyDown={imageGeneratorProps.handlePromptKeyDown}
                    onSubmit={imageGeneratorProps.generateImage}
                    hasEnoughCredits={true}
                    onClear={() => imageGeneratorProps.setPrompt('')}
                    onImprove={imageGeneratorProps.improveCurrentPrompt}
                    isImproving={imageGeneratorProps.isImproving}
                    credits={credits}
                    bonusCredits={bonusCredits}
                    userId={session?.user?.id}
                    onVisibilityChange={setIsPromptHidden}
                  />
                  <FixedPromptBox
                    isVisible={isPromptHidden}
                    prompt={imageGeneratorProps.prompt}
                    onClick={handleFixedPromptClick}
                  />
                </>
              )}

              <div className="md:mt-16">
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
            </>
          )}
        </div>

        {isSidebarMounted && (
          <div 
            className={cn(
              "w-full md:w-[350px] bg-card text-card-foreground",
              "md:fixed md:right-0 md:top-12 md:bottom-0",
              activeTab === 'input' ? 'block' : 'hidden md:block',
              "md:h-[calc(100vh-3rem)] relative",
              "transition-transform duration-300 ease-in-out",
              isSidebarVisible 
                ? "translate-x-0" 
                : "translate-x-full",
            )}
          >
            <div className="hidden md:block absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-card to-transparent pointer-events-none z-10" />
            <div className="hidden md:block absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />
            
            <div className="min-h-[calc(100vh-56px)] md:h-full overflow-y-auto md:scrollbar-none px-4 md:px-6 py-4 md:py-8">
              <CreditCounter credits={credits} bonusCredits={bonusCredits} className="block md:hidden mb-4" />
              <ImageGeneratorSettings {...imageGeneratorProps} hidePromptOnDesktop={true} />
            </div>
          </div>
        )}
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
