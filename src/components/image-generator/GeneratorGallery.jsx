import React from 'react';
import ImageGallery from '../ImageGallery';

const GeneratorGallery = ({
  userId,
  onImageClick,
  onDownload,
  onDiscard,
  onRemix,
  onViewDetails,
  activeView,
  generatingImages,
  nsfwEnabled,
  modelConfigs,
  activeFilters,
  searchQuery,
  setActiveTab,
  setStyle,
  showPrivate
}) => {
  return (
    <div className="md:mt-16 mt-12">
      <ImageGallery
        userId={userId}
        onImageClick={onImageClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
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
  );
};

export default GeneratorGallery;