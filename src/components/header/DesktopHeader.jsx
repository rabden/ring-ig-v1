import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu';
import ActionButtons from '../ActionButtons';
import SearchBar from '../search/SearchBar';
import NotificationBell from '../notifications/NotificationBell';
import PrivateFilterButton from '../filters/PrivateFilterButton';
import InspirationFilterButtons from '../filters/InspirationFilterButtons';
import { cn } from '@/lib/utils';

const DesktopHeader = ({ 
  user, 
  credits, 
  bonusCredits, 
  generatingImages,
  onSearch,
  showPrivate,
  onTogglePrivate,
  nsfwEnabled,
  setNsfwEnabled,
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
      <div className="hidden md:block fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10 h-14 border-b border-border/40">
        <div className="flex justify-between items-center h-full px-6 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className={cn(
              "flex items-center gap-3",
              "transition-transform duration-300 ease-spring"
            )}>
              <div className="h-9">
                <ProfileMenu 
                  user={user} 
                  credits={credits} 
                  bonusCredits={bonusCredits}
                  nsfwEnabled={nsfwEnabled}
                  setNsfwEnabled={setNsfwEnabled}
                />
              </div>
              <div className="h-9">
                <NotificationBell />
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-3",
              "transition-all duration-300 ease-spring"
            )}>
              <ActionButtons 
                generatingImages={generatingImages}
              />
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
              <div className="w-[280px]">
                <SearchBar onSearch={onSearch} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fade-out gradient */}
      <div className="hidden md:block fixed top-14 left-0 right-0 h-4 bg-gradient-to-b from-background/40 to-transparent pointer-events-none z-10" />
    </>
  );
};

export default DesktopHeader;