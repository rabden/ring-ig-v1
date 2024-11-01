import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const content = (
    <div
      className={cn(
        "relative flex items-start gap-4 rounded-lg border p-4 transition-colors",
        notification.is_read ? "bg-background" : "bg-muted"
      )}
    >
      {notification.image_url && (
        <img
          src={notification.image_url}
          alt=""
          className="h-10 w-10 rounded-full object-cover"
        />
      )}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(notification.created_at).toLocaleDateString()}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-6 w-6"
        onClick={() => deleteNotification(notification.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  if (notification.link) {
    return (
      <Link to={notification.link} onClick={handleClick}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={handleClick}>
      {content}
    </div>
  );
};

export default NotificationItem;