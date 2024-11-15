import React from 'react';
import { Heart, Users, UserPlus } from 'lucide-react';

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center gap-1 px-4">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-lg font-semibold">{value || 0}</span>
    </div>
    <span className="text-sm text-muted-foreground capitalize">{label}</span>
  </div>
);

const ProfileStats = ({ followersCount = 0, followingCount = 0, totalLikes = 0 }) => {
  return (
    <div className="flex justify-center items-center border rounded-lg py-4 bg-card">
      <StatItem icon={Users} label="followers" value={followersCount} />
      <div className="w-px h-12 bg-border" />
      <StatItem icon={UserPlus} label="following" value={followingCount} />
      <div className="w-px h-12 bg-border" />
      <StatItem icon={Heart} label="likes" value={totalLikes} />
    </div>
  );
};

export default ProfileStats;