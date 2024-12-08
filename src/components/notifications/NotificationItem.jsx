import React from 'react';
import { X, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { format } from 'date-fns';

const NotificationItem = ({ notification }) => {
  const { markAsRead, deleteNotification, hideGlobalNotification } = useNotifications();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handleClick = (e) => {
    e.preventDefault();
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const handleHideOrDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!notification.user_id) {
      hideGlobalNotification(notification.id);
    } else {
      deleteNotification(notification.id);
    }
  };

  const images = notification.image_url ? notification.image_url.split(',').map(url => url.trim()) : [];
  const links = notification.link ? notification.link.split(',').map(link => link.trim()) : [];
  const linkNames = notification.link_names ? notification.link_names.split(',').map(name => name.trim()) : [];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 p-4 transition-colors",
        !notification.is_read && "bg-muted/50"
      )}
      onClick={handleClick}
    >
      {notification.image_url && (
        <div className="flex-shrink-0 relative">
          <AspectRatio ratio={1} className="w-16">
            <img
              src={images[currentImageIndex]}
              alt=""
              className="rounded-md object-cover w-full h-full"
            />
            {images.length > 1 && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {currentImageIndex + 1}/{images.length}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </>
            )}
          </AspectRatio>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className={cn(
              "text-sm font-medium leading-none",
              !notification.is_read && "text-primary"
            )}>
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
            onClick={handleHideOrDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
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

        <p className="mt-1 text-[11px] text-muted-foreground">
          {format(new Date(notification.created_at), 'MMM d, h:mm a')}
        </p>
      </div>

      {!notification.is_read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" />
      )}
    </div>
  );
};

export default NotificationItem;