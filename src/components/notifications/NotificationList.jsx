import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import { Button } from "@/components/ui/button";
import { Check, Bell } from 'lucide-react';

const NotificationList = () => {
  const { notifications, markAllAsRead } = useNotifications();
  const hasUnread = notifications.some(n => !n.is_read);

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
        <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {hasUnread && (
        <div className="p-2 border-b bg-background/50 backdrop-blur-sm sticky top-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs" 
            onClick={markAllAsRead}
          >
            <Check className="h-3 w-3 mr-2" />
            Mark all as read
          </Button>
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {notifications.map((notification) => (
            <div key={notification.id} className="hover:bg-muted/50">
              <NotificationItem notification={notification} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationList;