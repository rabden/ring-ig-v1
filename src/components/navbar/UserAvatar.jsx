import React, { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = memo(({ session, isPro }) => (
  <div className={`rounded-full ${isPro ? 'p-[2px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500' : ''}`}>
    <Avatar className={`h-8 w-8 ${isPro ? 'border-2 border-background rounded-full' : ''}`}>
      <AvatarImage src={session?.user?.user_metadata?.avatar_url} alt={session?.user?.email} />
      <AvatarFallback>{session?.user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  </div>
));

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;