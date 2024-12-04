import React from 'react';
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings';
import ImageGallery from '@/components/ImageGallery';
import DesktopHeader from '@/components/header/DesktopHeader';
import MobileHeader from '@/components/header/MobileHeader';

const ImageGeneratorContent = ({
  session,
  credits,
  bonusCredits,
  activeView,
  setActiveView,
  generatingImages,
  activeFilters,
  handleFilterChange,
  handleRemoveFilter,
  handleSearch,
  nsfwEnabled,
  showPrivate,
  setShowPrivate,
  isHeaderVisible,
  activeTab,
  setActiveTab,
  handleGenerateImage,
  handleImageClick,
  handleDownload,
  handleDiscard,
  handleRemix,
  handleViewDetails,
  modelConfigs,
  searchQuery,
  setStyle,
  isPro,
  ...imageGeneratorState
}) => {
  return (
    <>
      <div className={`flex-grow p-2 md:p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
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
              onFilterChange={handleFilterChange}
              onRemoveFilter={handleRemoveFilter}
              onSearch={handleSearch}
              nsfwEnabled={nsfwEnabled}
              showPrivate={showPrivate}
              onTogglePrivate={() => setShowPrivate(!showPrivate)}
            />
            <MobileHeader
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onRemoveFilter={handleRemoveFilter}
              onSearch={handleSearch}
              isVisible={isHeaderVisible}
              nsfwEnabled={nsfwEnabled}
              showPrivate={showPrivate}
              onTogglePrivate={() => setShowPrivate(!showPrivate)}
              activeView={activeView}
            />
          </>
        )}

        <div className="md:mt-16 mt-12">
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
            modelConfigs={modelConfigs}
            activeFilters={activeFilters}
            searchQuery={searchQuery}
            setActiveTab={setActiveTab}
            setStyle={setStyle}
            showPrivate={showPrivate}
          />
        </div>
      </div>

      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-4 md:p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
        <ImageGeneratorSettings
          {...imageGeneratorState}
          session={session}
          credits={credits}
          bonusCredits={bonusCredits}
          nsfwEnabled={nsfwEnabled}
          proMode={isPro}
          modelConfigs={modelConfigs}
          generateImage={handleGenerateImage}
        />
      </div>
    </>
  );
};

export default ImageGeneratorContent;