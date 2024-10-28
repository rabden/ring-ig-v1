import React from 'react';
import { Image, Plus, User, Sparkles } from 'lucide-react';
import MobileProfileMenu from './MobileProfileMenu';

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, activeView, setActiveView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-around items-center md:hidden">
      <button
        onClick={() => {
          setActiveTab('images');
          setActiveView('myImages');
        }}
        className={`p-2 rounded-full flex flex-col items-center ${
          activeTab === 'images' && activeView === 'myImages' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-foreground'
        }`}
      >
        <Image size={20} />
        <span className="text-xs mt-1">My Images</span>
      </button>
      <button
        onClick={() => {
          setActiveTab('images');
          setActiveView('inspiration');
        }}
        className={`p-2 rounded-full flex flex-col items-center ${
          activeTab === 'images' && activeView === 'inspiration'
            ? 'bg-primary text-primary-foreground' 
            : 'text-foreground'
        }`}
      >
        <Sparkles size={20} />
        <span className="text-xs mt-1">Inspiration</span>
      </button>
      <button
        onClick={() => setActiveTab('input')}
        className={`p-2 rounded-full flex flex-col items-center ${
          activeTab === 'input' ? 'bg-primary text-primary-foreground' : 'text-foreground'
        }`}
      >
        <Plus size={20} />
        <span className="text-xs mt-1">Create</span>
      </button>
      <MobileProfileMenu user={session?.user} credits={credits} />
    </div>
  );
};

export default BottomNavbar;