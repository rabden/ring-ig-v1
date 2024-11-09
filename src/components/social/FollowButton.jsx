import React from 'react';
import { Button } from "@/components/ui/button";
import { useFollows } from '@/hooks/useFollows';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import SignInDialog from '@/components/SignInDialog';

const FollowButton = ({ targetUserId, variant = "default", size = "sm" }) => {
  const { session } = useSupabaseAuth();
  const { isFollowing, toggleFollow, isLoading } = useFollows(session?.user?.id);
  
  if (!session?.user) {
    return <SignInDialog />;
  }

  if (session.user.id === targetUserId) {
    return null;
  }

  const following = isFollowing(targetUserId);

  return (
    <Button
      variant={following ? "outline" : variant}
      size={size}
      onClick={() => toggleFollow(targetUserId)}
      disabled={isLoading}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  );
};

export default FollowButton;