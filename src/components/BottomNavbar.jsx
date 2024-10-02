import React, { useState } from 'react';
import { Image, Plus, User } from 'lucide-react';
import MobileProfileMenu from './MobileProfileMenu';
import { useUserCredits } from '@/hooks/useUserCredits';

const BottomNavbar = ({ activeTab, setActiveTab, session }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { credits } = useUserCredits(session?.user?.id);

  return (
    <>
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
        <button
          onClick={() => setIsProfileMenuOpen(true)}
          className="p-2 rounded-full text-foreground"
        >
          <User size={20} />
        </button>
      </div>
      <MobileProfileMenu
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
        user={session?.user}
        userCredits={credits}
      />
    </>
  );
};

export default BottomNavbar;