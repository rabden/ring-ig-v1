import React from 'react';
import { Heart, Users, UserPlus, Image } from 'lucide-react';

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-1.5">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <span className="text-sm">{value}</span>
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

const ProfileStats = ({ followersCount, followingCount, totalLikes, totalImages }) => {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      <StatItem icon={Users} label="followers" value={followersCount} />
      <StatItem icon={UserPlus} label="following" value={followingCount} />
      <StatItem icon={Heart} label="likes" value={totalLikes} />
      {totalImages !== undefined && (
        <StatItem icon={Image} label="images" value={totalImages} />
      )}
    </div>
  );
};

export default ProfileStats;