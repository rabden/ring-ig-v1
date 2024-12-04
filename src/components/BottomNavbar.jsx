import React, { memo, useState } from 'react';
import { Image, Plus, Sparkles, Bell, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import NotificationList from './notifications/NotificationList';
import { useNotifications } from '@/contexts/NotificationContext';
import { useProUser } from '@/hooks/useProUser';
import GeneratingImagesDrawer from './GeneratingImagesDrawer';
import UserAvatar from './navbar/UserAvatar';
import NavButton from './navbar/NavButton';

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, bonusCredits, activeView, setActiveView, generatingImages = [] }) => {
  const { unreadCount } = useNotifications();
  const { data: isPro } = useProUser(session?.user?.id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigation = (tab, view) => {
    if (tab === 'images') {
      setActiveTab('images');
      setActiveView(view);
    } else {
      setActiveTab(tab);
      // Reset activeView when not in images tab
      if (activeView && tab !== 'images') {
        setActiveView(null);
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/30 md:hidden z-50">
        <div className="flex items-center justify-around px-2 max-w-md mx-auto">
          <NavButton
            icon={Image}
            isActive={activeTab === 'images' && activeView === 'myImages'}
            onClick={() => handleNavigation('images', 'myImages')}
          />
          <NavButton
            icon={Sparkles}
            isActive={activeTab === 'images' && activeView === 'inspiration'}
            onClick={() => handleNavigation('images', 'inspiration')}
          />
          <NavButton
            icon={Plus}
            isActive={activeTab === 'input'}
            onClick={() => handleNavigation('input')}
            onLongPress={() => setDrawerOpen(true)}
            badge={generatingImages.length}
          />
          <NavButton
            icon={Bell}
            isActive={activeTab === 'notifications'}
            onClick={() => handleNavigation('notifications')}
          >
            <div className="relative">
              <Bell size={20} className={cn(
                "transition-transform duration-200",
                activeTab === 'notifications' ? "scale-100" : "scale-90 group-hover:scale-100"
              )} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </NavButton>
          <NavButton
            icon={User}
            isActive={activeTab === 'profile'}
            onClick={() => handleNavigation('profile')}
          >
            {session ? (
              <UserAvatar session={session} isPro={isPro} />
            ) : (
              <User size={20} className={cn(
                "transition-transform duration-200",
                activeTab === 'profile' ? "scale-100" : "scale-90 group-hover:scale-100"
              )} />
            )}
          </NavButton>
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