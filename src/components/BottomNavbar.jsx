import React, { memo, useState, useEffect } from 'react';
import { Image, Plus, Sparkles, User } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useProUser } from '@/hooks/useProUser';
import { useNavigate, useLocation } from 'react-router-dom';
import GeneratingImagesDrawer from './GeneratingImagesDrawer';
import MobileNavButton from './navbar/MobileNavButton';
import NotificationBell from './notifications/NotificationBell';
import ProfileMenu from './ProfileMenu';
import { cn } from "@/lib/utils";

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

  const handleNavigation = (route, tab) => {
    setActiveTab(tab);
    navigate(route);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-[2px] border-t border-border/80 md:hidden z-50 transition-all duration-300">
        <div className="flex items-center justify-around px-2 max-w-md mx-auto h-14">
          <MobileNavButton
            icon={Image}
            isActive={location.pathname === '/' && (!location.hash || location.hash === '#myimages')}
            onClick={() => handleNavigation('/#myimages', 'images')}
          />
          <MobileNavButton
            icon={Sparkles}
            isActive={location.pathname === '/inspiration'}
            onClick={() => handleNavigation('/inspiration', 'images')}
          />
          <div className={cn(
            "relative flex items-center justify-center",
            "before:absolute before:inset-x-0 before:-top-3 before:h-3 before:bg-gradient-to-t before:from-background/95 before:to-transparent before:pointer-events-none"
          )}>
            <MobileNavButton
              icon={Plus}
              isActive={location.hash === '#imagegenerate'}
              onClick={() => handleNavigation('/#imagegenerate', 'input')}
              onLongPress={() => setDrawerOpen(true)}
              badge={generatingImages.length}
              showCheckmark={showCheckmark}
            />
          </div>
          <MobileNavButton
            icon={NotificationBell}
            isActive={location.hash === '#notifications'}
            onClick={() => handleNavigation('/#notifications', 'notifications')}
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
        <div className="h-safe-area-bottom bg-background/95 backdrop-blur-[2px]" />
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