import React from 'react';
import { useFollowCounts } from '@/hooks/useFollowCounts';

const FollowStats = ({ userId }) => {
  const { followersCount, followingCount, isLoading } = useFollowCounts(userId);

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="flex gap-4 justify-center md:justify-start">
      <div className="text-center">
        <p className="text-2xl font-bold">{followersCount}</p>
        <p className="text-sm text-muted-foreground">Followers</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold">{followingCount}</p>
        <p className="text-sm text-muted-foreground">Following</p>
      </div>
    </div>
  );
};

export default FollowStats;