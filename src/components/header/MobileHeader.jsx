import React from 'react';
import SearchBar from '../search/SearchBar';
import PrivateFilterButton from '../filters/PrivateFilterButton';

const MobileHeader = ({ 
  onSearch,
  isVisible,
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
        <SearchBar onSearch={onSearch} className="[&_.search-icon]:h-5 [&_.search-icon]:w-5" />
      </div>
    </div>
  );
};

export default MobileHeader;