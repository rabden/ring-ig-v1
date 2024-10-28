import React from 'react';
import { Image, Plus, User, Sparkles } from 'lucide-react';
import MobileProfileMenu from './MobileProfileMenu';
import { cn } from "@/lib/utils";

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, activeView, setActiveView }) => {
  const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-16 h-14 transition-all",
        isActive ? "text-primary" : "text-muted-foreground",
        "relative group"
      )}
    >
      <div className={cn(
        "absolute inset-x-2 h-1 -top-2 rounded-full transition-all",
        isActive ? "bg-primary" : "bg-transparent"
      )} />
      <Icon size={18} className={cn(
        "transition-transform duration-200",
        isActive ? "scale-100" : "scale-90 group-hover:scale-100"
      )} />
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50 md:hidden">
      <div className="flex items-center justify-around px-2 py-1 max-w-md mx-auto">
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
        <div className="flex flex-col items-center justify-center w-16 h-14">
          <MobileProfileMenu user={session?.user} credits={credits} />
        </div>
      </div>
      <div className="h-safe-area-bottom bg-background/80 backdrop-blur-lg" />
    </div>
  );
};

export default BottomNavbar;