import React, { memo, useState } from 'react';
import { Image, Plus, Sparkles, User } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useProUser } from '@/hooks/useProUser';
import GeneratingImagesDrawer from './GeneratingImagesDrawer';
import MobileNavButton from './navbar/MobileNavButton';
import NotificationBell from './notifications/NotificationBell';
import ProfileMenu from './ProfileMenu';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, bonusCredits, activeView, setActiveView, generatingImages = [] }) => {
  const { unreadCount } = useNotifications();
  const { data: isPro } = useProUser(session?.user?.id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleNavigation = (path, tab, view) => {
    navigate(path);
    if (setActiveTab) setActiveTab(tab);
    if (setActiveView) setActiveView(view);
  };

  const handlePlusClick = () => {
    if (currentPath !== '/') {
      navigate('/');
      // Use setTimeout to ensure navigation completes before tab switch
      setTimeout(() => {
        setActiveTab('input');
        setActiveView('myImages');
      }, 0);
    } else {
      setActiveTab('input');
      setActiveView('myImages');
    }
  };

  const handleNotificationClick = () => {
    if (currentPath !== '/') {
      navigate('/');
      // Use setTimeout to ensure navigation completes before tab switch
      setTimeout(() => {
        setActiveTab('notifications');
        setActiveView('myImages');
      }, 0);
    } else {
      setActiveTab('notifications');
      setActiveView('myImages');
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/30 md:hidden z-50">
        <div className="flex items-center justify-around px-2 max-w-md mx-auto">
          <MobileNavButton
            icon={Image}
            isActive={currentPath === '/'}
            onClick={() => handleNavigation('/', 'images', 'myImages')}
          />
          <MobileNavButton
            icon={Sparkles}
            isActive={currentPath === '/inspiration'}
            onClick={() => handleNavigation('/inspiration', 'images', 'inspiration')}
          />
          <MobileNavButton
            icon={Plus}
            isActive={activeTab === 'input'}
            onClick={handlePlusClick}
            onLongPress={() => setDrawerOpen(true)}
            badge={generatingImages.length}
          />
          <MobileNavButton
            icon={NotificationBell}
            isActive={activeTab === 'notifications'}
            onClick={handleNotificationClick}
          />
          <div className="flex items-center justify-center">
            {session ? (
              <div className="group">
                <ProfileMenu 
                  user={session.user} 
                  credits={credits} 
                  bonusCredits={bonusCredits} 
                  isMobile={true}
                />
              </div>
            ) : (
              <MobileNavButton
                icon={User}
                isActive={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              />
            )}
          </div>
        </div>
        <div className="h-safe-area-bottom bg-background" />
      </div>

      <GeneratingImagesDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        generatingImages={generatingImages}
      />
    </>
  );
};

export default memo(BottomNavbar);