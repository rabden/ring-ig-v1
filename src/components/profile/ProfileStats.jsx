import React from 'react';
import { Card } from "@/components/ui/card";
import FollowStats from '../social/FollowStats';

const ProfileStats = ({ stats, userId }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4 text-center">
        <p className="text-2xl font-bold">{stats?.totalImages || 0}</p>
        <p className="text-sm text-muted-foreground">Images</p>
      </Card>
      <Card className="p-4 text-center">
        <p className="text-2xl font-bold">{stats?.totalLikes || 0}</p>
        <p className="text-sm text-muted-foreground">Likes</p>
      </Card>
      <FollowStats userId={userId} />
    </div>
  );
};

export default ProfileStats;