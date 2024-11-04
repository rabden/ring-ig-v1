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
  nsfwEnabled,
  showPrivate,
  onTogglePrivate
}) => {
  return (
    <div className="hidden md:block fixed top-0 left-0 right-[350px] bg-background z-10 px-10 py-3">
      <div className="flex justify-between items-center max-w-full">
        <div className="flex items-center gap-2 whitespace-nowrap">
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
              activeView={activeView}
              showPrivate={showPrivate}
              onTogglePrivate={onTogglePrivate}
            />
          )}
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;