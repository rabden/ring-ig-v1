import React from 'react';
import { Image, Plus, User } from 'lucide-react';
import MobileProfileMenu from './MobileProfileMenu';

const BottomNavbar = ({ activeTab, setActiveTab, session, credits, nsfwEnabled, setNsfwEnabled }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-around items-center md:hidden">
      <button
        onClick={() => setActiveTab('images')}
        className={`p-2 rounded-full ${activeTab === 'images' ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
      >
        <Image size={20} />
      </button>
      <button
        onClick={() => setActiveTab('input')}
        className={`p-2 rounded-full ${activeTab === 'input' ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
      >
        <Plus size={20} />
      </button>
      <MobileProfileMenu 
        user={session?.user} 
        credits={credits} 
        nsfwEnabled={nsfwEnabled}
        setNsfwEnabled={setNsfwEnabled}
      />
    </div>
  );
};

export default BottomNavbar;