import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import FollowButton from '../social/FollowButton';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

const ProfileHeader = ({ profile, stats }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
      <ProfileAvatar user={{ user_metadata: { avatar_url: profile.avatar_url }}} size="lg" />
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-bold mb-2">{profile.display_name}</h1>
        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Joined {stats?.joinDate ? format(new Date(stats.joinDate), 'MMMM yyyy') : ''}</span>
        </div>
      </div>
      <FollowButton targetUserId={profile.id} />
    </div>
  );
};

export default ProfileHeader;