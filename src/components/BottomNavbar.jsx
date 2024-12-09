import React, { memo, useState, useEffect } from 'react';
import { Image, Plus, Sparkles, User, Check } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useProUser } from '@/hooks/useProUser';
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
  activeView, 
  setActiveView, 
  generatingImages = [],
  nsfwEnabled,
  setNsfwEnabled
}) => {
  const { unreadCount } = useNotifications();
  const { data: isPro } = useProUser(session?.user?.id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [prevLength, setPrevLength] = useState(generatingImages.length);

  // Handle showing checkmark when an image completes
  useEffect(() => {
    if (generatingImages.length < prevLength && prevLength > 0) {
      // Show checkmark for 1.5s when an image completes
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
            isActive={activeTab === 'images' && activeView === 'myImages'}
            onClick={() => {
              setActiveTab('images');
              setActiveView('myImages');
            }}
          />
          <MobileNavButton
            icon={Sparkles}
            isActive={activeTab === 'images' && activeView === 'inspiration'}
            onClick={() => {
              setActiveTab('images');
              setActiveView('inspiration');
            }}
          />
          <MobileNavButton
            icon={Plus}
            isActive={activeTab === 'input'}
            onClick={() => setActiveTab('input')}
            onLongPress={() => setDrawerOpen(true)}
          >
            {(generatingImages.length > 0 || showCheckmark) && (
              <span className={cn(
                "absolute top-1 right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center",
                showCheckmark && "animate-in zoom-in duration-300"
              )}>
                {showCheckmark ? (
                  <Check className="h-3 w-3" />
                ) : (
                  generatingImages.length > 9 ? '9+' : generatingImages.length
                )}
              </span>
            )}
          </MobileNavButton>
          <MobileNavButton
            icon={NotificationBell}
            isActive={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
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