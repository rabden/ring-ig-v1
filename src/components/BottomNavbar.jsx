import React from 'react';
import { Image, Plus, User, Sparkles } from 'lucide-react';
import MobileProfileMenu from './MobileProfileMenu';
import { cn } from "@/lib/utils";

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, activeView, setActiveView }) => {
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
    <div className="fixed bottom-0 left-0 right-0 bg-background/70 backdrop-blur-xl border-t border-border/30 md:hidden z-50">
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
        <div className="flex flex-col items-center justify-center w-14 h-12">
          <MobileProfileMenu user={session?.user} credits={credits} />
        </div>
      </div>
      <div className="h-safe-area-bottom bg-background/70 backdrop-blur-xl" />
    </div>
  );
};

export default BottomNavbar;