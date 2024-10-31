import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Handle initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Handle auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      queryClient.invalidateQueries('user');
      setLoading(false);
    });

    // Handle URL hash for OAuth redirects
    const handleHashChange = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.has('access_token')) {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session) {
          setSession(session);
          queryClient.invalidateQueries('user');
          // Clear the URL hash
          window.history.replaceState(null, null, window.location.pathname);
        }
      }
    };

    // Check for hash params on mount
    handleHashChange();

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
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};