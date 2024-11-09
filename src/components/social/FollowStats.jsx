import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const FollowStats = ({ userId }) => {
  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('followers_count, following_count')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  if (!profile) return null;

  return (
    <div className="flex gap-4 text-sm text-muted-foreground">
      <div>
        <span className="font-medium text-foreground">{profile.followers_count}</span> followers
      </div>
      <div>
        <span className="font-medium text-foreground">{profile.following_count}</span> following
      </div>
    </div>
  );
};

export default FollowStats;