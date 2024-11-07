import React from 'react';
import DesktopHeader from '../header/DesktopHeader';
import MobileHeader from '../header/MobileHeader';

const GeneratorHeader = ({ 
  session, 
  credits, 
  bonusCredits, 
  activeView, 
  setActiveView,
  generatingImages,
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  nsfwEnabled,
  showPrivate,
  onTogglePrivate,
  isHeaderVisible
}) => {
  return (
    <>
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
            onTogglePrivate={onTogglePrivate}
          />
          <MobileHeader
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            onRemoveFilter={onRemoveFilter}
            onSearch={onSearch}
            isVisible={isHeaderVisible}
            nsfwEnabled={nsfwEnabled}
            showPrivate={showPrivate}
            onTogglePrivate={onTogglePrivate}
            activeView={activeView}
          />
        </>
      )}
    </>
  );
};

export default GeneratorHeader;