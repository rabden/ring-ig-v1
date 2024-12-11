import React, { memo, useState, useEffect } from 'react';
import { Image, Plus, Sparkles, User } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useProUser } from '@/hooks/useProUser';
import { useNavigate, useLocation } from 'react-router-dom';
import GeneratingImagesDrawer from './GeneratingImagesDrawer';
import MobileNavButton from './navbar/MobileNavButton';
import NotificationBell from './notifications/NotificationBell';
import ProfileMenu from './ProfileMenu';

const BottomNavbar = ({ 
  activeTab, 
  setActiveTab, 
  session, 
  credits, 
  bonusCredits, 
  generatingImages = [],
  nsfwEnabled,
  setNsfwEnabled
}) => {
  const { unreadCount } = useNotifications();
  const { data: isPro } = useProUser(session?.user?.id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [prevLength, setPrevLength] = useState(generatingImages.length);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle showing checkmark when an image completes
  useEffect(() => {
    if (generatingImages.length < prevLength && prevLength > 0) {
      setShowCheckmark(true);
      const timer = setTimeout(() => {
        setShowCheckmark(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
    setPrevLength(generatingImages.length);
  }, [generatingImages.length, prevLength]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/30 md:hidden z-50">
        <div className="flex items-center justify-around px-2 max-w-md mx-auto">
          <MobileNavButton
            icon={Image}
            isActive={location.pathname === '/' && (!location.hash || location.hash === '#myimages')}
            onClick={() => {
              setActiveTab('images');
              navigate('/#myimages');
            }}
          />
          <MobileNavButton
            icon={Sparkles}
            isActive={location.pathname === '/inspiration'}
            onClick={() => {
              setActiveTab('images');
              navigate('/inspiration');
            }}
          />
          <MobileNavButton
            icon={Plus}
            isActive={location.hash === '#imagegenerate'}
            onClick={() => {
              setActiveTab('input');
              navigate('/#imagegenerate');
            }}
            onLongPress={() => setDrawerOpen(true)}
            badge={generatingImages.length}
            showCheckmark={showCheckmark}
          />
          <MobileNavButton
            icon={NotificationBell}
            isActive={location.hash === '#notifications'}
            onClick={() => {
              setActiveTab('notifications');
              navigate('/#notifications');
            }}
          />
          <div className="flex items-center justify-center">
            {session ? (
              <div className="group">
                <ProfileMenu 
                  user={session.user} 
                  credits={credits} 
                  bonusCredits={bonusCredits} 
                  isMobile={true}
                  nsfwEnabled={nsfwEnabled}
                  setNsfwEnabled={setNsfwEnabled}
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