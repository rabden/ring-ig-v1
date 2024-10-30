import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const UsersSection = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_credits (credit_count)
        `);
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading users...</div>;

  return (
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <div className="space-y-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="text-sm">{user.display_name || 'Anonymous User'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Credits: {user.user_credits?.[0]?.credit_count || 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default UsersSection;