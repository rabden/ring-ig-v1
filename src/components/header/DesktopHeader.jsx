import React from 'react';
import ProfileMenu from '../ProfileMenu';
import ActionButtons from '../ActionButtons';
import SearchBar from '../search/SearchBar';
import NotificationBell from '../notifications/NotificationBell';
import PrivateFilterButton from '../filters/PrivateFilterButton';

const DesktopHeader = ({ 
  user, 
  credits, 
  bonusCredits, 
  activeView, 
  setActiveView, 
  generatingImages,
  onSearch,
  showPrivate,
  onTogglePrivate
}) => {
  return (
    <div className="hidden md:block fixed top-0 left-0 right-0 bg-background z-10 h-12">
      <div className="flex justify-between items-center h-full px-10 max-w-full">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="h-8">
            <ProfileMenu 
              user={user} 
              credits={credits} 
              bonusCredits={bonusCredits}
            />
          </div>
          <div className="h-8">
            <NotificationBell />
          </div>
          <ActionButtons 
            activeView={activeView} 
            setActiveView={setActiveView} 
            generatingImages={generatingImages}
          />
          {activeView === 'myImages' && (
            <PrivateFilterButton
              showPrivate={showPrivate}
              onToggle={onTogglePrivate}
            />
          )}
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;