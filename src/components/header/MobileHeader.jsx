import React from 'react';
import FilterMenu from '../filters/FilterMenu';
import SearchBar from '../search/SearchBar';

const MobileHeader = ({ 
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  isVisible
}) => {
  return (
    <div className={`md:hidden fixed top-0 left-0 right-0 bg-background z-10 px-2 py-1 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center justify-end overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center gap-1">
          <FilterMenu
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            onRemoveFilter={onRemoveFilter}
          />
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;