import React from 'react';
import { Image, Plus, Sparkles, Bell } from 'lucide-react';
import MobileProfileMenu from './MobileProfileMenu';
import { cn } from "@/lib/utils";
import { Drawer } from 'vaul';
import NotificationList from './notifications/NotificationList';

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, bonusCredits, activeView, setActiveView, proMode, setProMode }) => {
  const [notificationDrawerOpen, setNotificationDrawerOpen] = React.useState(false);

  const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-14 h-12 transition-all",
        isActive ? "text-primary" : "text-muted-foreground",
        "relative group"
      )}
    >
      <div className={cn(
        "absolute inset-x-2 h-0.5 -top-1 rounded-full transition-all",
        isActive ? "bg-primary" : "bg-transparent"
      )} />
      <Icon size={16} className={cn(
        "transition-transform duration-200",
        isActive ? "scale-100" : "scale-90 group-hover:scale-100"
      )} />
      <span className="text-[9px] mt-0.5 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/30 md:hidden z-50">
      <div className="flex items-center justify-around px-2 max-w-md mx-auto">
        <NavButton
          icon={Image}
          label="My Images"
          isActive={activeTab === 'images' && activeView === 'myImages'}
          onClick={() => {
            setActiveTab('images');
            setActiveView('myImages');
          }}
        />
        <NavButton
          icon={Sparkles}
          label="Inspiration"
          isActive={activeTab === 'images' && activeView === 'inspiration'}
          onClick={() => {
            setActiveTab('images');
            setActiveView('inspiration');
          }}
        />
        <NavButton
          icon={Plus}
          label="Create"
          isActive={activeTab === 'input'}
          onClick={() => setActiveTab('input')}
        />
        <Drawer.Root open={notificationDrawerOpen} onOpenChange={setNotificationDrawerOpen}>
          <Drawer.Trigger asChild>
            <NavButton
              icon={Bell}
              label="Notifications"
              isActive={false}
            />
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
            <Drawer.Content className="bg-background flex flex-col rounded-t-[20px] fixed bottom-0 left-0 right-0 max-h-[85vh] z-[60]">
              <div className="p-4 bg-muted/40 rounded-t-[20px] flex-1">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mb-8" />
                <NotificationList />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
        <div className="flex flex-col items-center justify-center w-14 h-12">
          <MobileProfileMenu 
            user={session?.user} 
            credits={credits}
            bonusCredits={bonusCredits}
            proMode={proMode}
            setProMode={setProMode}
          />
        </div>
      </div>
      <div className="h-safe-area-bottom bg-background" />
    </div>
  );
};

export default BottomNavbar;