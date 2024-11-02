import React from 'react';
import ProfileMenu from '../ProfileMenu';
import ActionButtons from '../ActionButtons';
import FilterMenu from '../filters/FilterMenu';
import SearchBar from '../search/SearchBar';
import NotificationBell from '../notifications/NotificationBell';

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
  nsfwEnabled
}) => {
  return (
    <div className="hidden md:block fixed top-4 left-4 right-[350px] z-10">
      <div className="bg-muted rounded-lg px-4 py-3 border border-border/40 shadow-lg">
        <div className="flex justify-between items-center max-w-full">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <div className="h-8">
              <ProfileMenu 
                user={user} 
                credits={credits} 
                bonusCredits={bonusCredits}
              />
            </div>
            <div className="h-8">
              <NotificationBell />
            </div>
            <ActionButtons 
              activeView={activeView} 
              setActiveView={setActiveView} 
              generatingImages={generatingImages}
            />
            {!nsfwEnabled && (
              <FilterMenu
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                onRemoveFilter={onRemoveFilter}
                nsfwEnabled={nsfwEnabled}
              />
            )}
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;