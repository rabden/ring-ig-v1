import React from 'react';

const FollowStats = ({ followersCount = 0, followingCount = 0 }) => {
  return (
    <div className="flex gap-4">
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