import React, { useState, useEffect } from 'react';
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ImageCardAvatar = React.memo(({ imageOwner, isOwnerPro }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (imageOwner?.avatar_url) {
      // Pre-load the image
      const img = new Image();
      img.onload = () => {
        setAvatarUrl(imageOwner.avatar_url);
        setImageLoaded(true);
      };
      img.onerror = () => {
        setHasError(true);
      };
      img.src = imageOwner.avatar_url;
    }
  }, [imageOwner?.avatar_url]);

  return (
    <div className={`rounded-full ${isOwnerPro ? 'p-[2px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500' : ''}`}>
      <Avatar className={`h-6 w-6 flex-shrink-0 ${isOwnerPro ? 'border-2 border-background rounded-full' : ''}`}>
        {imageLoaded && !hasError ? (
          <AvatarImage 
            src={avatarUrl}
            className="object-cover"
          />
        ) : (
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.imageOwner?.avatar_url === nextProps.imageOwner?.avatar_url &&
    prevProps.isOwnerPro === nextProps.isOwnerPro
  );
});

ImageCardAvatar.displayName = 'ImageCardAvatar';

export default ImageCardAvatar;