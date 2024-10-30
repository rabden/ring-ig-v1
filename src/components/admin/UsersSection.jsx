import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const UsersSection = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // First get all users from auth.users
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('id, email, created_at');

      if (authError) throw authError;

      // Then get their credits
      const { data: credits, error: creditsError } = await supabase
        .from('user_credits')
        .select('user_id, credit_count');

      if (creditsError) throw creditsError;

      // Combine the data
      return authUsers.map(user => ({
        ...user,
        credit_count: credits.find(c => c.user_id === user.id)?.credit_count || 0
      }));
    }
  });

  if (isLoading) return <div>Loading users...</div>;

  return (
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <div className="space-y-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="text-sm">{user.email || 'Anonymous User'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Credits: {user.credit_count}
              </p>
              <p className="text-xs text-muted-foreground">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default UsersSection;