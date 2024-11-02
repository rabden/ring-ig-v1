import React from 'react';
import FilterMenu from '../filters/FilterMenu';
import SearchBar from '../search/SearchBar';

const MobileHeader = ({ 
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  nsfwEnabled
}) => {
  return (
    <div className="md:hidden fixed top-2 left-4 right-4 z-10">
      <div className="bg-muted rounded-lg px-2 py-2 border border-border/40 shadow-lg">
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