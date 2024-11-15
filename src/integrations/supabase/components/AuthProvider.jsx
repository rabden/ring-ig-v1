import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const handleAuthSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(currentSession);
    } catch (error) {
      console.error('Auth error:', error);
      // Clear invalid session data
      window.localStorage.removeItem('supabase.auth.token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAuthSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN') {
        setSession(session);
        queryClient.invalidateQueries('user');
        toast.success('Successfully signed in!');
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        queryClient.invalidateQueries('user');
        window.localStorage.removeItem('supabase.auth.token');
        toast.success('Successfully signed out');
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(session);
        queryClient.invalidateQueries('user');
      } else if (event === 'USER_UPDATED') {
        setSession(session);
        queryClient.invalidateQueries('user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      queryClient.invalidateQueries('user');
      window.localStorage.removeItem('supabase.auth.token');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};