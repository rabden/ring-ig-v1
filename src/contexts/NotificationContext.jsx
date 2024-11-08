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

      // Fetch global notifications
      const { data: allGlobalNotifications } = await supabase
        .from('global_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter out hidden global notifications
      const visibleGlobalNotifications = (allGlobalNotifications || [])
        .filter(n => {
          const hiddenUsers = (n.hidden_by || '').split(',').filter(Boolean);
          return !hiddenUsers.includes(session.user.id);
        });

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
    if (!session?.user?.id) return;

    try {
      // Get the current notification
      const { data: notification } = await supabase
        .from('global_notifications')
        .select('hidden_by')
        .eq('id', notificationId)
        .single();

      if (!notification) {
        toast.error('Notification not found');
        return;
      }

      // Parse current hidden_by and add new user ID
      const hiddenUsers = (notification.hidden_by || '').split(',').filter(Boolean);
      
      if (!hiddenUsers.includes(session.user.id)) {
        hiddenUsers.push(session.user.id);
      }

      // Update the notification with new hidden_by value
      const { error } = await supabase
        .from('global_notifications')
        .update({ hidden_by: hiddenUsers.join(',') })
        .eq('id', notificationId);

      if (error) {
        console.error('Error updating notification:', error);
        toast.error('Failed to hide notification');
        return;
      }

      // Update local state
      setGlobalNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notification hidden successfully');
    } catch (error) {
      console.error('Error hiding notification:', error);
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