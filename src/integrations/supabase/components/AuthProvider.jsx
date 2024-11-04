import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const handleAuthSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setLoading(false);
    } catch (error) {
      console.error('Auth error:', error);
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
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        queryClient.invalidateQueries('user');
        localStorage.removeItem('supabase.auth.token');
      } else if (event === 'TOKEN_REFRESHED') {
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
      localStorage.removeItem('supabase.auth.token');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};