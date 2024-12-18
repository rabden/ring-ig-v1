import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../search/SearchBar';
import PrivateFilterButton from '../filters/PrivateFilterButton';
import InspirationFilterButtons from '../filters/InspirationFilterButtons';
import { cn } from '@/lib/utils';

const MobileHeader = ({ 
  onSearch,
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
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex flex-col gap-3 p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchBar onSearch={onSearch} />
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
            "transition-all duration-300 ease-spring"
          )}>
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
          </div>
        </div>
      </div>
      {/* Fade-out gradient */}
      <div className="md:hidden fixed top-[84px] left-0 right-0 h-4 bg-gradient-to-b from-background/40 to-transparent pointer-events-none z-10" />
    </>
  );
};

export default MobileHeader;