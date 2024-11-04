import React from 'react';
import FilterMenu from '../filters/FilterMenu';
import SearchBar from '../search/SearchBar';
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

const MobileHeader = ({ 
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  isVisible,
  nsfwEnabled,
  activeView,
  showTopFilter,
  setShowTopFilter,
  activeTab
}) => {
  // Only show header when activeTab is 'images' and activeView is either 'myImages' or 'inspiration'
  if (activeTab !== 'images' || (activeView !== 'myImages' && activeView !== 'inspiration')) {
    return null;
  }

  return (
    <div className={`md:hidden fixed top-0 left-0 right-0 bg-background z-10 px-2 py-2 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center justify-end gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {!nsfwEnabled && (
          <FilterMenu
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            onRemoveFilter={onRemoveFilter}
            nsfwEnabled={nsfwEnabled}
          />
        )}
        {activeView === 'inspiration' && (
          <Button
            variant={showTopFilter ? 'default' : 'outline'}
            onClick={() => setShowTopFilter(!showTopFilter)}
            className="text-xs px-2 py-1 h-8"
            size="sm"
          >
            <Flame className="h-4 w-4 mr-1" />
            Top
          </Button>
        )}
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
};

export default MobileHeader;