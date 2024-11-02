import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationList from './NotificationList';

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 p-0 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0 m-4 rounded-lg border max-h-[calc(100vh-2rem)]">
        <div className="h-full overflow-hidden flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <NotificationList />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationBell;