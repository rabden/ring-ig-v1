import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { format } from 'date-fns';

const MobileNotificationItem = ({ notification }) => {
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
    deleteNotification(notification.id);
  };

  const images = notification.image_url ? notification.image_url.split(',').map(url => url.trim()) : [];
  const links = notification.link ? notification.link.split(',').map(link => link.trim()) : [];
  const linkNames = notification.link_names ? notification.link_names.split(',').map(name => name.trim()) : [];

  return (
    <div
      className={cn(
        "relative flex gap-3 p-4 transition-colors",
        !notification.is_read && "bg-muted/50"
      )}
      onClick={handleClick}
    >
      {images.length > 0 && (
        <div className="flex-shrink-0">
          <AspectRatio ratio={1} className="w-14">
            <img
              src={images[0]}
              alt=""
              className="rounded-lg object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1.5">
            <p className={cn(
              "text-sm font-medium leading-none",
              !notification.is_read && "text-primary"
            )}>
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
            
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1.5">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    to={link}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {linkNames[index] || `View details`}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            )}
            
            <p className="text-[11px] text-muted-foreground">
              {format(new Date(notification.created_at), 'MMM d, h:mm a')}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mr-2"
            onClick={handleDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {!notification.is_read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" />
      )}
    </div>
  );
};

export default MobileNotificationItem; 