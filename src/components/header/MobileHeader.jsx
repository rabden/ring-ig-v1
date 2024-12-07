import React from 'react';
import FilterMenu from '../filters/FilterMenu';
import SearchBar from '../search/SearchBar';
import PrivateFilterButton from '../filters/PrivateFilterButton';

const MobileHeader = ({ 
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  isVisible,
  nsfwEnabled,
  showPrivate,
  onTogglePrivate,
  activeView
}) => {
  return (
    <div className={`md:hidden fixed top-0 left-0 right-0 bg-background z-10 px-2 py-2 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center justify-end gap-2 overflow-x-auto whitespace-nowrap">
        {activeView === 'myImages' && (
          <PrivateFilterButton
            showPrivate={showPrivate}
            onToggle={onTogglePrivate}
          />
        )}
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
  );
};

export default MobileHeader;