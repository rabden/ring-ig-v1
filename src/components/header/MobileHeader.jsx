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
        "md:hidden fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-[2px] z-10 transition-all duration-200 ease-in-out border-b border-border/10 shadow-sm",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex items-center gap-2.5">
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
      {/* Fade-out gradient */}
      <div className="h-2 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />
    </div>
  );
};

export default MobileHeader;