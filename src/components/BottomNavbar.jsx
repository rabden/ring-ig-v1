import React, { memo, useState, useRef, useEffect } from 'react';
import { Image, Plus, Sparkles, Bell, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import NotificationList from './notifications/NotificationList';
import { useNotifications } from '@/contexts/NotificationContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProUser } from '@/hooks/useProUser';
import GeneratingImagesDrawer from './GeneratingImagesDrawer';

const UserAvatar = memo(({ session, isPro }) => (
  <div className={`rounded-full ${isPro ? 'p-[2px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500' : ''}`}>
    <Avatar className={`h-8 w-8 ${isPro ? 'border-2 border-background rounded-full' : ''}`}>
      <AvatarImage src={session?.user?.user_metadata?.avatar_url} alt={session?.user?.email} />
      <AvatarFallback>{session?.user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  </div>
));

UserAvatar.displayName = 'UserAvatar';

const NavButton = memo(({ icon: Icon, isActive, onClick, children, badge, onLongPress }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef(null);
  const touchStartTime = useRef(0);
  const isMoved = useRef(false);

  const handleTouchStart = (e) => {
    isMoved.current = false;
    touchStartTime.current = Date.now();
    if (onLongPress) {
      pressTimer.current = setTimeout(() => {
        if (!isMoved.current) {
          setIsPressed(true);
          onLongPress();
        }
      }, 500);
    }
  };

  const handleTouchMove = () => {
    isMoved.current = true;
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      setIsPressed(false);
    }
  };

  const handleTouchEnd = (e) => {
    const touchDuration = Date.now() - touchStartTime.current;
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    setIsPressed(false);

    // Only trigger click if it wasn't a long press and the touch didn't move
    if (touchDuration < 500 && !isMoved.current) {
      onClick?.(e);
    }
  };

  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  }, []);

  return (
    <button
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if (e.pointerType !== 'touch') {
          onClick?.(e);
        }
      }}
      className={cn(
        "flex items-center justify-center w-14 h-12 transition-all relative",
        isActive ? "text-primary" : "text-muted-foreground",
        "relative group"
      )}
    >
      <div className={cn(
        "absolute inset-x-2 h-0.5 -top-1 rounded-full transition-all",
        isActive ? "bg-primary" : "bg-transparent"
      )} />
      {children || (
        <>
          <Icon size={20} className={cn(
            "transition-transform duration-200",
            isActive ? "scale-100" : "scale-90 group-hover:scale-100"
          )} />
          {badge > 0 && (
            <span className="absolute top-1 right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </>
      )}
    </button>
  );
});

NavButton.displayName = 'NavButton';

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, bonusCredits, activeView, setActiveView, generatingImages = [] }) => {
  const { unreadCount } = useNotifications();
  const { data: isPro } = useProUser(session?.user?.id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/30 md:hidden z-50">
        <div className="flex items-center justify-around px-2 max-w-md mx-auto">
          <NavButton
            icon={Image}
            isActive={activeTab === 'images' && activeView === 'myImages'}
            onClick={() => {
              setActiveTab('images');
              setActiveView('myImages');
            }}
          />
          <NavButton
            icon={Sparkles}
            isActive={activeTab === 'images' && activeView === 'feed'}
            onClick={() => {
              setActiveTab('images');
              setActiveView('feed');
            }}
          />
          <NavButton
            icon={Plus}
            isActive={activeTab === 'input'}
            onClick={() => setActiveTab('input')}
            onLongPress={() => setDrawerOpen(true)}
            badge={generatingImages.length}
          />
          <NavButton
            icon={Bell}
            isActive={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
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
            onClick={() => setActiveTab('profile')}
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
