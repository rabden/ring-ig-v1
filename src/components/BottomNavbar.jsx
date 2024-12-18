import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';
import { Home, Image, Bell, User } from 'lucide-react';
import NotificationBell from './notifications/NotificationBell';

const BottomNavbar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const handleNavigation = (path, hash) => {
    navigate(path);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const NavItem = ({ icon: Icon, label, isActive, onClick, badge }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 w-full h-full",
        "transition-all duration-200 ease-spring",
        "hover:text-primary active:scale-95",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      <div className="relative">
        <Icon className="h-5 w-5" />
        {badge && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-t border-border/40 z-50">
      <div className="grid grid-cols-4 h-full">
        <NavItem
          icon={Home}
          label="Home"
          isActive={location.hash === '#myimages' || !location.hash}
          onClick={() => handleNavigation('/#myimages')}
        />
        <NavItem
          icon={Image}
          label="Inspiration"
          isActive={location.pathname === '/inspiration'}
          onClick={() => handleNavigation('/inspiration')}
        />
        <NavItem
          icon={Bell}
          label="Notifications"
          isActive={location.hash === '#notifications'}
          onClick={() => handleNavigation('/#notifications')}
          badge={unreadCount > 0}
        />
        <NavItem
          icon={User}
          label="Profile"
          isActive={location.hash === '#profile'}
          onClick={() => handleNavigation('/#profile')}
        />
      </div>
    </div>
  );
};

export default BottomNavbar;