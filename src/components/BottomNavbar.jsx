import React from 'react';
import { Image, Plus, Sparkles } from 'lucide-react';
import MobileProfileMenu from './MobileProfileMenu';
import { cn } from "@/lib/utils";

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, bonusCredits, activeView, setActiveView, proMode, setProMode }) => {
  const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
        isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5",
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="text-xs font-medium hidden sm:block">{label}</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/30 md:hidden z-50">
      <div className="flex items-center justify-around gap-1 px-3 py-2 max-w-md mx-auto">
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
        <div className="flex-shrink-0">
          <button
            onClick={() => setActiveTab('input')}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full transition-all",
              activeTab === 'input' 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "bg-muted hover:bg-muted/80"
            )}
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex items-center">
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