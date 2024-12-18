import React from 'react';
import { Heart, Users, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatItem = ({ icon: Icon, label, value }) => (
  <div className={cn(
    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
    "transition-all duration-200 hover:bg-accent/40",
    "group cursor-default"
  )}>
    <Icon className={cn(
      "w-3.5 h-3.5 md:w-4 md:h-4",
      "text-muted-foreground/70",
      "transition-colors duration-200",
      "group-hover:text-accent-foreground"
    )} />
    <span className={cn(
      "text-sm md:text-base font-medium",
      "transition-colors duration-200",
      "group-hover:text-accent-foreground"
    )}>
      {value}
    </span>
    <span className={cn(
      "text-xs md:text-sm",
      "text-muted-foreground/70",
      "transition-colors duration-200",
      "group-hover:text-muted-foreground"
    )}>
      {label}
    </span>
  </div>
);

const ProfileStats = ({ followersCount, followingCount, totalLikes }) => {
  return (
    <div className={cn(
      "flex items-center gap-2 justify-center",
      "bg-muted/40 rounded-xl p-1",
      "backdrop-blur-sm"
    )}>
      <StatItem icon={Users} label="followers" value={followersCount} />
      <StatItem icon={UserPlus} label="following" value={followingCount} />
      <StatItem icon={Heart} label="likes" value={totalLikes} />
    </div>
  );
};

export default ProfileStats;