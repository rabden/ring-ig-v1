import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationItem = ({ notification }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = (e) => {
    e.preventDefault();
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteNotification(notification.id);
  };

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 transition-colors hover:bg-accent/50",
        notification.is_read ? "bg-background" : "bg-accent/20"
      )}
      onClick={handleClick}
    >
      {notification.actor && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={notification.actor.avatar_url} alt={notification.actor.display_name} />
          <AvatarFallback>{notification.actor.display_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="font-medium leading-none">{notification.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(notification.created_at).toLocaleDateString()}
            </p>
            {notification.link && (
              <Link
                to={notification.link}
                className="text-sm text-primary hover:underline mt-2 inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                {notification.link_names || 'View'}
              </Link>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;