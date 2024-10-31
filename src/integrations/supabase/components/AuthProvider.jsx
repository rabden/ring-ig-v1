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
      // Check URL parameters for auth redirects
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      // Handle email confirmation
      if (params.has('access_token') || hashParams.has('access_token')) {
        await supabase.auth.setSession({
          access_token: params.get('access_token') || hashParams.get('access_token'),
          refresh_token: params.get('refresh_token') || hashParams.get('refresh_token'),
        });
        
        // Refresh session after setting tokens
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (newSession) {
          setSession(newSession);
          toast.success('Successfully signed in!');
          // Clean up URL
          window.history.replaceState(null, null, window.location.pathname);
        }
      } else if (currentSession) {
        setSession(currentSession);
        toast.success('Successfully signed in!');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial session check and handle redirects
    handleAuthSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN') {
        setSession(session);
        queryClient.invalidateQueries('user');
        toast.success('Successfully signed in!');
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        queryClient.invalidateQueries('user');
        toast.success('Successfully signed out!');
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
      window.localStorage.removeItem('supabase.auth.token');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};