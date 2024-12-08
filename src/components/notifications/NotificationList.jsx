import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import MobileNotificationItem from './MobileNotificationItem';
import { Bell } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const NotificationList = () => {
  const { notifications } = useNotifications();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const NotificationComponent = isMobile ? MobileNotificationItem : NotificationItem;

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
        <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {notifications.map((notification) => (
            <div key={notification.id} className="hover:bg-muted/50">
              <NotificationComponent notification={notification} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationList;