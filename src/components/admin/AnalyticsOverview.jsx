import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const AnalyticsOverview = () => {
  const { data: totalImages } = useQuery({
    queryKey: ['adminTotalImages'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_images')
        .select('*', { count: 'exact' });
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: activeUsers } = useQuery({
    queryKey: ['adminActiveUsers'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: totalCredits } = useQuery({
    queryKey: ['adminTotalCredits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credit_count');
      if (error) throw error;
      return data.reduce((sum, user) => sum + user.credit_count, 0);
    }
  });

  const { data: weeklyData } = useQuery({
    queryKey: ['adminWeeklyImages'],
    queryFn: async () => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);

      const { data, error } = await supabase
        .from('user_images')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const dailyCounts = data.reduce((acc, img) => {
        const day = new Date(img.created_at).getDay();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      return days.map((name, index) => ({
        name,
        images: dailyCounts[index] || 0
      }));
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImages || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Image Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData || []}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="images" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;