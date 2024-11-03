import React from 'react';
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ImageCardAvatar = React.memo(({ imageOwner, isOwnerPro }) => {
  return (
    <div className={`rounded-full ${isOwnerPro ? 'p-[2px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500' : ''}`}>
      <Avatar className={`h-6 w-6 flex-shrink-0 ${isOwnerPro ? 'border-2 border-background rounded-full' : ''}`}>
        <AvatarImage src={imageOwner?.avatar_url} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
});

ImageCardAvatar.displayName = 'ImageCardAvatar';

export default ImageCardAvatar;