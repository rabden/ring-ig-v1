import React, { memo, useState } from 'react';
import { Image, Plus, Sparkles, User } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useProUser } from '@/hooks/useProUser';
import GeneratingImagesDrawer from './GeneratingImagesDrawer';
import MobileNavButton from './navbar/MobileNavButton';
import UserAvatar from './navbar/UserAvatar';
import NotificationBell from './notifications/NotificationBell';

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, bonusCredits, activeView, setActiveView, generatingImages = [] }) => {
  const { unreadCount } = useNotifications();
  const { data: isPro } = useProUser(session?.user?.id);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
            badge={generatingImages.length}
          />
          <MobileNavButton
            icon={NotificationBell}
            isActive={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
          />
          <MobileNavButton
            icon={User}
            isActive={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          >
            {session ? (
              <UserAvatar session={session} isPro={isPro} />
            ) : (
              <User size={20} className="transition-transform duration-200 scale-90 group-hover:scale-100" />
            )}
          </MobileNavButton>
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