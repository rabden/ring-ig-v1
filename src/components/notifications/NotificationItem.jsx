import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";

const NotificationItem = ({ notification, isGlobal = false }) => {
  const { markAsRead, deleteNotification, hideGlobalNotification } = useNotifications();

  const handleClick = (e) => {
    e.preventDefault();
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const handleHideOrDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isGlobal) {
      hideGlobalNotification(notification.id);
    } else {
      deleteNotification(notification.id);
    }
  };

  const images = notification.image_url ? notification.image_url.split(',').map(url => url.trim()) : [];
  const links = notification.link ? notification.link.split(',').map(link => link.trim()) : [];
  const linkNames = notification.link_names ? notification.link_names.split(',').map(name => name.trim()) : [];

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-lg border p-4 transition-colors",
        notification.is_read ? "bg-background" : "bg-muted"
      )}
      onClick={handleClick}
    >
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium">{notification.title}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleHideOrDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(notification.created_at).toLocaleDateString()}
        </p>
      </div>

      {images.length > 0 && (
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {images.map((url, index) => (
              <div key={index} className="flex-shrink-0">
                <img
                  src={url}
                  alt=""
                  className="h-48 w-48 rounded-lg object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link}
              className="text-sm text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {linkNames[index] || `Link ${index + 1}`}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationItem;