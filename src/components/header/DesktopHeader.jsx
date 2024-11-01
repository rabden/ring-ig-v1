import React from 'react';
import ProfileMenu from '../ProfileMenu';
import ActionButtons from '../ActionButtons';
import FilterMenu from '../filters/FilterMenu';
import SearchBar from '../search/SearchBar';

const DesktopHeader = ({ 
  user, 
  credits, 
  bonusCredits, 
  activeView, 
  setActiveView, 
  generatingImages,
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  isVisible,
  nsfwEnabled
}) => {
  return (
    <div className={`hidden md:block fixed top-0 left-0 right-[350px] bg-background z-10 px-4 py-3 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex justify-between items-center max-w-full">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <ProfileMenu 
            user={user} 
            credits={credits} 
            bonusCredits={bonusCredits}
          />
          <ActionButtons 
            activeView={activeView} 
            setActiveView={setActiveView} 
            generatingImages={generatingImages}
          />
          <FilterMenu
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            onRemoveFilter={onRemoveFilter}
            nsfwEnabled={nsfwEnabled}
          />
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;