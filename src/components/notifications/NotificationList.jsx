import React from 'react';
import { Button } from "@/components/ui/button";
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import { ScrollArea } from "@/components/ui/scroll-area";
import { BellRing } from 'lucide-react';

const NotificationList = () => {
  const { notifications, markAllAsRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <BellRing className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-medium text-muted-foreground mb-1">No notifications</h3>
        <p className="text-sm text-muted-foreground/70">
          When you get notifications, they'll show up here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex justify-between items-center sticky top-0 bg-background z-10">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={markAllAsRead}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Mark all as read
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationList;