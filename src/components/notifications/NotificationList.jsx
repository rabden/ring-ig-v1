import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationList = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        No notifications
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
        />
      ))}
    </div>
  );
};

export default NotificationList;