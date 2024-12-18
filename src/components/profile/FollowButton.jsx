import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { useFollows } from '@/hooks/useFollows';

const FollowButton = ({ userId, className }) => {
  const { isFollowing, toggleFollow } = useFollows(userId);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => toggleFollow()}
    >
      {isFollowing ? (
        <UserMinus className="h-4 w-4 mr-2" />
      ) : (
        <UserPlus className="h-4 w-4 mr-2" />
      )}
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;