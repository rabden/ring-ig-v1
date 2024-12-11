import React, { memo, useState, useRef, useEffect } from 'react';
import { Image, Plus, Sparkles, User, Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useNotifications } from '@/contexts/NotificationContext';
import { useProUser } from '@/hooks/useProUser';
import GeneratingImagesDrawer from './GeneratingImagesDrawer';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from './notifications/NotificationBell';
import ProfileMenu from './ProfileMenu';

const NavButton = memo(({ icon: Icon, isActive, onClick, children, badge, onLongPress, showCheckmark }) => {
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
        // Only handle click for non-touch devices
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
          {(badge > 0 || showCheckmark) && (
            <span className={cn(
              "absolute top-1 right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center",
              showCheckmark && "animate-in zoom-in duration-300"
            )}>
              {showCheckmark ? (
                <Check className="h-3 w-3" />
              ) : (
                badge > 9 ? '9+' : badge
              )}
            </span>
          )}
        </>
      )}
    </button>
  );
});

NavButton.displayName = 'NavButton';

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

  const handleNavigation = (tab, view) => {
    // First set the tab and view state
    setActiveTab(tab);
    if (setActiveView && view) {
      setActiveView(view);
    }

    // Then handle navigation based on tab and current location
    if (location.pathname === '/inspiration') {
      if (tab === 'notifications' || tab === 'input' || (tab === 'images' && view === 'myImages')) {
        navigate('/');
      }
    } else if (tab === 'images' && view === 'inspiration') {
      navigate('/inspiration');
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/30 md:hidden z-50">
        <div className="flex items-center justify-around px-2 max-w-md mx-auto">
          <NavButton
            icon={Image}
            isActive={location.pathname === '/' && activeView === 'myImages'}
            onClick={() => handleNavigation('images', 'myImages')}
          />
          <NavButton
            icon={Sparkles}
            isActive={location.pathname === '/inspiration'}
            onClick={() => handleNavigation('images', 'inspiration')}
          />
          <NavButton
            icon={Plus}
            isActive={activeTab === 'input'}
            onClick={() => handleNavigation('input')}
            onLongPress={() => setDrawerOpen(true)}
            badge={generatingImages.length}
            showCheckmark={showCheckmark}
          />
          <NavButton
            icon={NotificationBell}
            isActive={activeTab === 'notifications'}
            onClick={() => handleNavigation('notifications')}
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
              <NavButton
                icon={User}
                isActive={activeTab === 'profile'}
                onClick={() => handleNavigation('profile')}
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