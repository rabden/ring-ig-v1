import React from 'react';
import { Card } from "@/components/ui/card";
import FollowStats from '../social/FollowStats';

const MobileProfileStats = ({ user, credits, bonusCredits, totalLikes }) => {
  return (
    <>
      <Card className="p-4 grid grid-cols-2 gap-4">
        <div className="text-center space-y-1">
          <p className="text-2xl font-bold">{credits}+{bonusCredits}</p>
          <p className="text-sm text-muted-foreground">Credits</p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-2xl font-bold">{totalLikes}</p>
          <p className="text-sm text-muted-foreground">Likes</p>
        </div>
      </Card>
      {user && <FollowStats userId={user.id} />}
    </>
  );
};

export default MobileProfileStats;