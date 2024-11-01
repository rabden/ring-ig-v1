import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { session } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationId) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', session?.user?.id]);
    },
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (notificationId) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', session?.user?.id]);
    },
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${session.user.id}`,
      }, () => {
        queryClient.invalidateQueries(['notifications', session.user.id]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      markAsRead,
      deleteNotification,
      unreadCount: notifications.filter(n => !n.is_read).length,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};