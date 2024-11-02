import React from 'react';
import FilterMenu from '../filters/FilterMenu';
import SearchBar from '../search/SearchBar';

const MobileHeader = ({ 
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  isVisible,
  nsfwEnabled
}) => {
  return (
    <div className={`md:hidden fixed top-2 left-2 right-2 z-10 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 shadow-lg border border-border/40 rounded-lg px-2 py-2">
        <div className="flex items-center justify-end gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
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
  );
};

export default MobileHeader;