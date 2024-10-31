import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Handle initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        toast.success('Successfully signed in!');
      }
      setLoading(false);
    });

    // Handle auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      setSession(session);
      queryClient.invalidateQueries('user');

      if (event === 'SIGNED_IN') {
        toast.success('Successfully signed in!');
      } else if (event === 'SIGNED_OUT') {
        toast.success('Successfully signed out!');
      }

      // Handle email verification and OAuth redirects
      if (window.location.hash) {
        const params = new URLSearchParams(window.location.hash.substring(1));
        if (params.has('access_token') || params.has('error')) {
          // Clear the URL hash after processing
          window.history.replaceState(null, null, window.location.pathname);
        }
      }

      setLoading(false);
    });

    // Check for email confirmation success
    const checkEmailConfirmation = async () => {
      const params = new URLSearchParams(window.location.search);
      if (params.has('email_confirm') && params.get('email_confirm') === 'true') {
        // Get the latest session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          setSession(currentSession);
          toast.success('Email verified successfully!');
          // Clear the URL parameters
          window.history.replaceState(null, null, window.location.pathname);
        }
      }
    };

    checkEmailConfirmation();

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