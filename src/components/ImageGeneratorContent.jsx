import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFollows } from '@/hooks/useFollows';

const ImageGeneratorContent = ({
  session,
  credits,
  bonusCredits,
  activeTab,
  setActiveTab,
  generatingImages,
  nsfwEnabled,
  setNsfwEnabled,
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
  proMode,
  className
}) => {
  const location = useLocation();
  const isMobile = window.innerWidth < 768;
  const isInspiration = location.pathname === '/inspiration';
  const isGenerateTab = location.hash === '#imagegenerate';
  const isNotificationsTab = location.hash === '#notifications';
  const shouldShowSettings = isMobile ? isGenerateTab : !isInspiration;
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSidebarMounted, setIsSidebarMounted] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const { following } = useFollows(session?.user?.id);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle sidebar visibility with transitions
  useEffect(() => {
    const shouldMount = isMobile 
      ? isGenerateTab
      : shouldShowSettings && isPromptVisible && !isInspiration && !searchQuery;

    if (shouldMount) {
      setIsSidebarMounted(true);
      requestAnimationFrame(() => {
        setIsSidebarVisible(true);
      });
    } else {
      setIsSidebarVisible(false);
      const timer = setTimeout(() => {
        setIsSidebarMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [shouldShowSettings, isPromptVisible, isInspiration, isGenerateTab, isMobile, searchQuery]);

  // Track window resize for mobile state
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        window.location.reload();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Sync activeTab with URL hash
  useEffect(() => {
    if (isGenerateTab) {
      setActiveTab('input');
    } else if (isNotificationsTab) {
      setActiveTab('notifications');
    } else {
      setActiveTab('images');
    }
  }, [location.hash, setActiveTab]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch(query);
  };

  // Handle private toggle
  const handlePrivateToggle = (newValue) => {
    setShowPrivate(newValue);
  };

  // Reset search when changing views
  useEffect(() => {
    if (!isInspiration && !location.hash.includes('myimages')) {
      setSearchQuery('');
      onSearch('');
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <div className={cn(
        "flex flex-col md:flex-row min-h-screen",
        "bg-background text-foreground",
        "image-generator-content",
        className
      )}>
        <div className={cn(
          "flex-grow overflow-y-auto",
          "transition-all duration-300 ease-spring",
          "p-2 md:p-6",
          !isGenerateTab ? 'block' : 'hidden md:block',
          isSidebarVisible ? 'md:pr-[350px]' : 'md:pr-6',
          "pb-20 md:pb-6"
        )}>
          {session && (
            <>
              <DesktopHeader
                user={session.user}
                credits={credits}
                bonusCredits={bonusCredits}
                generatingImages={generatingImages}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                onRemoveFilter={onRemoveFilter}
                onSearch={handleSearch}
                nsfwEnabled={nsfwEnabled}
                setNsfwEnabled={setNsfwEnabled}
                showPrivate={showPrivate}
                onTogglePrivate={handlePrivateToggle}
                showFollowing={showFollowing}
                showTop={showTop}
                onFollowingChange={setShowFollowing}
                onTopChange={setShowTop}
                searchQuery={searchQuery}
              />
              <MobileHeader
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                onRemoveFilter={onRemoveFilter}
                onSearch={handleSearch}
                isVisible={isHeaderVisible}
                nsfwEnabled={nsfwEnabled}
                showPrivate={showPrivate}
                onTogglePrivate={handlePrivateToggle}
                showFollowing={showFollowing}
                showTop={showTop}
                onFollowingChange={setShowFollowing}
                onTopChange={setShowTop}
                searchQuery={searchQuery}
              />
              
              {!isInspiration && !searchQuery && (
                <DesktopPromptBox
                  prompt={imageGeneratorProps.prompt}
                  onChange={(e) => imageGeneratorProps.setPrompt(e.target.value)}
                  onKeyDown={imageGeneratorProps.handlePromptKeyDown}
                  onSubmit={imageGeneratorProps.generateImage}
                  hasEnoughCredits={true}
                  onClear={() => imageGeneratorProps.setPrompt('')}
                  credits={credits}
                  bonusCredits={bonusCredits}
                  userId={session?.user?.id}
                  onVisibilityChange={setIsPromptVisible}
                  activeModel={imageGeneratorProps.model}
                  modelConfigs={imageGeneratorProps.modelConfigs}
                />
              )}

              <div className={cn(
                "md:mt-16",
                "transition-all duration-300 ease-spring"
              )}>
                <ImageGallery
                  userId={session?.user?.id}
                  onImageClick={handleImageClick}
                  onDownload={handleDownload}
                  onDiscard={handleDiscard}
                  onRemix={handleRemix}
                  onViewDetails={handleViewDetails}
                  generatingImages={generatingImages}
                  nsfwEnabled={nsfwEnabled}
                  modelConfigs={imageGeneratorProps.modelConfigs}
                  activeFilters={activeFilters}
                  searchQuery={searchQuery}
                  showPrivate={showPrivate}
                  showFollowing={showFollowing}
                  showTop={showTop}
                  following={following}
                />
              </div>
            </>
          )}
        </div>

        {isSidebarMounted && !searchQuery && (
          <div 
            className={cn(
              "w-full md:w-[350px]",
              "bg-card/80 backdrop-blur-sm text-card-foreground",
              "md:fixed md:right-0 md:top-12 md:bottom-0",
              isGenerateTab ? 'block' : 'hidden md:block',
              "md:h-[calc(100vh-3rem)] relative",
              "transition-all duration-300 ease-spring",
              isSidebarVisible 
                ? "translate-x-0 opacity-100" 
                : isMobile 
                  ? "translate-x-full opacity-0" 
                  : "md:translate-x-full md:opacity-0",
              "border-l border-border/30"
            )}
          >
            {/* Fade gradients */}
            <div className={cn(
              "hidden md:block absolute top-0 left-0 right-0 h-8",
              "bg-gradient-to-b from-card to-transparent",
              "pointer-events-none z-10"
            )} />
            <div className={cn(
              "hidden md:block absolute bottom-0 left-0 right-0 h-8",
              "bg-gradient-to-t from-card to-transparent",
              "pointer-events-none z-10"
            )} />
            
            <div className={cn(
              "min-h-[calc(100vh-56px)] md:h-full",
              "overflow-y-auto md:scrollbar-none",
              "px-4 md:px-6 py-4 md:py-8"
            )}>
              <ImageGeneratorSettings 
                {...imageGeneratorProps} 
                hidePromptOnDesktop={!isMobile && !isGenerateTab}
                credits={credits}
                bonusCredits={bonusCredits}
                session={session}
                updateCredits={imageGeneratorProps.updateCredits}
                proMode={proMode}
                nsfwEnabled={nsfwEnabled}
                setNsfwEnabled={setNsfwEnabled}
              />
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
        nsfwEnabled={nsfwEnabled}
        setNsfwEnabled={setNsfwEnabled}
      />
    </>
  );
};

export default ImageGeneratorContent;
