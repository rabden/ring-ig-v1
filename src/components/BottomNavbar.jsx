import React from 'react';
import { Image, Plus, Sparkles, Bell } from 'lucide-react';
import MobileProfileMenu from './MobileProfileMenu';
import { cn } from "@/lib/utils";
import { Drawer } from 'vaul';
import NotificationList from './notifications/NotificationList';
import { useNotifications } from '@/contexts/NotificationContext';

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, bonusCredits, activeView, setActiveView, proMode, setProMode }) => {
  const [notificationDrawerOpen, setNotificationDrawerOpen] = React.useState(false);
  const { unreadCount } = useNotifications();

  const NavButton = ({ icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-14 h-12 transition-all relative",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      <div className={cn(
        "absolute inset-x-2 h-0.5 -top-1 rounded-full transition-all",
        isActive ? "bg-primary" : "bg-transparent"
      )} />
      <Icon size={20} className={cn(
        "transition-transform duration-200",
        isActive ? "scale-100" : "scale-90 group-hover:scale-100"
      )} />
    </button>
  );

  return (
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
          isActive={activeTab === 'images' && activeView === 'inspiration'}
          onClick={() => {
            setActiveTab('images');
            setActiveView('inspiration');
          }}
        />
        <NavButton
          icon={Plus}
          isActive={activeTab === 'input'}
          onClick={() => setActiveTab('input')}
        />
        <div className="relative">
          <NavButton
            icon={Bell}
            isActive={false}
            onClick={() => setNotificationDrawerOpen(true)}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <MobileProfileMenu 
          user={session?.user} 
          credits={credits}
          bonusCredits={bonusCredits}
          proMode={proMode}
          setProMode={setProMode}
        />
      </div>
      <div className="h-safe-area-bottom bg-background" />
    </div>
  );
};

export default BottomNavbar;
