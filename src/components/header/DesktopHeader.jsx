import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu';
import ActionButtons from '../ActionButtons';
import SearchBar from '../search/SearchBar';
import NotificationBell from '../notifications/NotificationBell';
import PrivateFilterButton from '../filters/PrivateFilterButton';
import InspirationFilterButtons from '../filters/InspirationFilterButtons';

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
      <div className="hidden md:block fixed top-0 left-0 right-0 bg-background z-10 h-12">
        <div className="flex justify-between items-center h-full px-10 max-w-full">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="h-8">
              <ProfileMenu 
                user={user} 
                credits={credits} 
                bonusCredits={bonusCredits}
                nsfwEnabled={nsfwEnabled}
                setNsfwEnabled={setNsfwEnabled}
              />
            </div>
            <div className="h-8">
              <NotificationBell />
            </div>
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
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
      </div>
      {/* Fade-out gradient */}
      <div className="hidden md:block fixed top-12 left-0 right-0 h-2 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
    </>
  );
};

export default DesktopHeader;