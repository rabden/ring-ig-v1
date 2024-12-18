import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProfileAvatar = ({ 
  user, 
  isPro, 
  size = 'md', 
  onEditClick,
  showEditOnHover = true 
}) => {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-20 w-20',
    lg: 'h-24 w-24'
  };

  const cameraSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="relative group">
      <div className={cn(
        "rounded-full transition-transform duration-200",
        isPro && "p-[2px] bg-gradient-to-tr from-amber-300/60 via-amber-400/60 to-yellow-400/60"
      )}>
        <Avatar className={cn(
          sizeClasses[size],
          "transition-all duration-200",
          isPro && "border-2 border-background rounded-full",
          "ring-2 ring-background"
        )}>
          <AvatarImage 
            src={user.user_metadata?.avatar_url} 
            alt={user.email}
            className="object-cover"
          />
          <AvatarFallback className="bg-muted/50 text-muted-foreground font-medium">
            {user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      {showEditOnHover && onEditClick && (
        <button 
          onClick={onEditClick}
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "rounded-full bg-background/80 backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100",
            "transition-all duration-200 ease-spring",
            "group-hover:backdrop-blur-md"
          )}
        >
          <Camera className={cn(
            cameraSizeClasses[size],
            "text-foreground/70 transition-transform duration-200",
            "group-hover:scale-110 group-hover:text-foreground"
          )} />
        </button>
      )}
    </div>
  );
};

export default ProfileAvatar;