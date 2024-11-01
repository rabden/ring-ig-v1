import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NOTIFICATION_TEMPLATES } from '@/utils/notificationTemplates';

const NotificationList = () => {
  const { notifications, markAsRead, deleteNotification } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No notifications
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="p-2 space-y-2">
        {notifications.map((notification) => {
          const template = NOTIFICATION_TEMPLATES[notification.template_type];
          const { title, message, image, avatar } = template.getMessage(notification.metadata);

          return (
            <div
              key={notification.id}
              className={`p-3 rounded-lg relative ${
                notification.is_read ? 'bg-background' : 'bg-muted'
              }`}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{title}</h4>
                  <p className="text-sm text-muted-foreground">{message}</p>
                  {image && (
                    <img
                      src={image}
                      alt="Notification image"
                      className="mt-2 rounded-md w-full h-32 object-cover"
                    />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default NotificationList;