import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from 'lucide-react';

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
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="relative group">
      <div className={`rounded-full ${isPro ? 'p-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500' : ''}`}>
        <Avatar className={`${sizeClasses[size]} ${isPro ? 'border-2 border-background rounded-full' : ''}`}>
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
          <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      {showEditOnHover && onEditClick && (
        <button 
          onClick={onEditClick}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className={`${cameraSizeClasses[size]} text-white`} />
        </button>
      )}
    </div>
  );
};

export default ProfileAvatar;