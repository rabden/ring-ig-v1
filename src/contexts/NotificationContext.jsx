import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [notifications, setNotifications] = useState([]);
  const [globalNotifications, setGlobalNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchNotifications = async () => {
      // Fetch user profile to get hidden notifications
      const { data: profile } = await supabase
        .from('profiles')
        .select('hidden_global_notifications')
        .eq('id', session.user.id)
        .single();

      const hiddenIds = new Set(
        (profile?.hidden_global_notifications || '')
          .split(',')
          .filter(Boolean)
          .map(id => id.trim())
      );

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

      const visibleGlobalNotifications = (allGlobalNotifications || [])
        .filter(n => !hiddenIds.has(n.id.toString()));

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
    const { data: profile } = await supabase
      .from('profiles')
      .select('hidden_global_notifications')
      .eq('id', session.user.id)
      .single();

    const currentHidden = (profile?.hidden_global_notifications || '')
      .split(',')
      .filter(Boolean)
      .map(id => id.trim());

    const newHidden = [...new Set([...currentHidden, notificationId.toString()])].join(',');

    const { error } = await supabase
      .from('profiles')
      .update({ hidden_global_notifications: newHidden })
      .eq('id', session.user.id);

    if (!error) {
      setGlobalNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
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