import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationList from './NotificationList';
import { cn } from '@/lib/utils';

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-7 w-7 p-0 relative md:flex",
            unreadCount > 0 && "after:content-[''] after:absolute after:top-1 after:right-1 after:w-2 after:h-2 after:bg-red-500 after:rounded-full after:ring-2 after:ring-background"
          )}
        >
          <Bell className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-full sm:w-[380px] p-0 m-4 rounded-lg border bg-background/80 backdrop-blur-xl max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({unreadCount} new)
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>
        <NotificationList />
      </SheetContent>
    </Sheet>
  );
};

export default NotificationBell;
