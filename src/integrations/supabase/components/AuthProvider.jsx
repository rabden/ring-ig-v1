import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const clearAuthData = () => {
    setSession(null);
    queryClient.invalidateQueries('user');
    window.localStorage.removeItem('supabase.auth.token');
    // Clear any other auth-related data from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('supabase.auth.')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleAuthSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth session error:', error);
        clearAuthData();
        return;
      }
      
      if (!currentSession) {
        clearAuthData();
        return;
      }

      // Verify the session is still valid
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('User verification error:', userError);
        clearAuthData();
        return;
      }

      setSession(currentSession);
    } catch (error) {
      console.error('Auth error:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAuthSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      switch (event) {
        case 'SIGNED_IN':
          setSession(session);
          queryClient.invalidateQueries('user');
          break;
        case 'SIGNED_OUT':
          clearAuthData();
          break;
        case 'TOKEN_REFRESHED':
          setSession(session);
          queryClient.invalidateQueries('user');
          break;
        case 'USER_UPDATED':
          setSession(session);
          queryClient.invalidateQueries('user');
          break;
        case 'USER_DELETED':
          clearAuthData();
          break;
        default:
          // Handle any unexpected events
          if (!session) {
            clearAuthData();
          }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuthData();
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