import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../search/SearchBar';
import PrivateFilterButton from '../filters/PrivateFilterButton';
import InspirationFilterButtons from '../filters/InspirationFilterButtons';
import { cn } from '@/lib/utils';

const MobileHeader = ({ 
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  isVisible,
  nsfwEnabled,
  showPrivate,
  onTogglePrivate,
  showFollowing,
  showTop,
  onFollowingChange,
  onTopChange
}) => {
  const location = useLocation();
  const isInspiration = location.pathname === '/inspiration';
  const isMyImages = location.pathname === '/' && (!location.hash || location.hash === '#myimages');

  return (
    <div 
      className={cn(
        "md:hidden fixed top-0 left-0 right-0 bg-background z-10 transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center gap-2">
          {isMyImages && (
            <PrivateFilterButton
              showPrivate={showPrivate}
              onToggle={onTogglePrivate}
            />
          )}
          {isInspiration && (
            <InspirationFilterButtons
              showFollowing={showFollowing}
              showTop={showTop}
              onFollowingChange={onFollowingChange}
              onTopChange={onTopChange}
            />
          )}
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;