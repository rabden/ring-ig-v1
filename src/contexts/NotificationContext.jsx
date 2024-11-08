import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [globalNotifications, setGlobalNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchNotifications = async () => {
      // Fetch user-specific notifications
      const { data: userNotifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      // Fetch global notifications that haven't been hidden by the current user
      const { data: allGlobalNotifications } = await supabase
        .from('global_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      const visibleGlobalNotifications = (allGlobalNotifications || [])
        .filter(n => !n.hidden_by?.split(',').includes(session.user.id));

      setNotifications(userNotifications || []);
      setGlobalNotifications(visibleGlobalNotifications);
      
      const unreadUserNotifications = (userNotifications || []).filter(n => !n.is_read).length;
      setUnreadCount(unreadUserNotifications + visibleGlobalNotifications.length);
    };

    fetchNotifications();

    const notificationsChannel = supabase
      .channel('notifications_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${session.user.id}` },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    const globalNotificationsChannel = supabase
      .channel('global_notifications_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'global_notifications' },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(globalNotificationsChannel);
    };
  }, [session?.user?.id]);

  const markAsRead = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const deleteNotification = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (!error) {
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const hideGlobalNotification = async (notificationId) => {
    try {
      // Get current notification data
      const { data: notification, error: fetchError } = await supabase
        .from('global_notifications')
        .select('hidden_by')
        .eq('id', notificationId)
        .single();

      if (fetchError) {
        console.error('Error fetching notification:', fetchError);
        toast.error('Failed to hide notification');
        return;
      }

      // Parse existing hidden users
      const currentHidden = (notification?.hidden_by || '').split(',').filter(Boolean);

      // Add new user ID if not already hidden
      if (!currentHidden.includes(session.user.id)) {
        const newHidden = [...currentHidden, session.user.id].join(',');

        const { error: updateError } = await supabase
          .from('global_notifications')
          .update({ hidden_by: newHidden })
          .eq('id', notificationId);

        if (updateError) {
          console.error('Error updating hidden notifications:', updateError);
          toast.error('Failed to hide notification');
          return;
        }

        setGlobalNotifications(prev => prev.filter(n => n.id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Notification hidden successfully');
      }
    } catch (error) {
      console.error('Error hiding global notification:', error);
      toast.error('Failed to hide notification');
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications: [...notifications, ...globalNotifications].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ),
      unreadCount,
      markAsRead,
      deleteNotification,
      hideGlobalNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};