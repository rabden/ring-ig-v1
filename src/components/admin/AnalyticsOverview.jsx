import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const AnalyticsOverview = () => {
  const { data: totalImages } = useQuery({
    queryKey: ['adminTotalImages'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_credits')
        .select('credit_count');

      if (error) throw error;
      return data.reduce((sum, user) => sum + user.credit_count, 0);
    }
  });

  const { data: monthlyData } = useQuery({
    queryKey: ['adminMonthlyImages'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const endDate = new Date();
      const startDate = subDays(endDate, 30);

      const { data, error } = await supabase
        .from('user_images')
        .select('created_at')
        .gte('created_at', startOfDay(startDate).toISOString())
        .lte('created_at', endOfDay(endDate).toISOString());

      if (error) throw error;

      // Create an array of the last 30 days
      const dailyCounts = Array.from({ length: 31 }, (_, i) => {
        const date = subDays(endDate, i);
        return {
          date: format(date, 'MMM dd'),
          images: 0,
          fullDate: date
        };
      }).reverse();

      // Count images for each day
      data.forEach(img => {
        const imgDate = new Date(img.created_at);
        const dayIndex = dailyCounts.findIndex(day => 
          startOfDay(day.fullDate).getTime() === startOfDay(imgDate).getTime()
        );
        if (dayIndex !== -1) {
          dailyCounts[dayIndex].images++;
        }
      });

      // Remove the fullDate property before returning
      return dailyCounts.map(({ date, images }) => ({ date, images }));
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
          <CardTitle>30 Day Image Generation Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData || []}>
                <XAxis 
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={2}
                />
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