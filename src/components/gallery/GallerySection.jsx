import React from 'react';
import ImageGallery from '@/components/ImageGallery';
import DesktopHeader from '@/components/header/DesktopHeader';
import MobileHeader from '@/components/header/MobileHeader';

const GallerySection = ({
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
  userId,
  handleImageClick,
  handleDownload,
  handleDiscard,
  handleRemix,
  handleViewDetails,
  searchQuery,
  setActiveTab,
  setStyle,
  style
}) => {
  return (
    <div className="flex-grow p-2 md:p-6 overflow-y-auto md:pr-[350px] pb-20 md:pb-6">
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
          userId={userId}
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
          setStyle={setStyle}
          style={style}
          showPrivate={showPrivate}
        />
      </div>
    </div>
  );
};

export default GallerySection;