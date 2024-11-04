import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      if (currentSession) {
        setSession(currentSession);
        // Always redirect to home if we have a valid session, regardless of current path
        if (location.pathname === '/login') {
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      console.error('Auth session error:', error);
      toast.error('Authentication error. Please try signing in again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial session check
    handleAuthSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      switch (event) {
        case 'SIGNED_IN':
          setSession(session);
          queryClient.invalidateQueries(['user']);
          // Always navigate to home on sign in
          navigate('/', { replace: true });
          toast.success('Successfully signed in!');
          break;

        case 'SIGNED_OUT':
          setSession(null);
          queryClient.invalidateQueries(['user']);
          queryClient.clear();
          localStorage.removeItem('supabase.auth.token');
          navigate('/login', { replace: true });
          toast.success('Successfully signed out');
          break;

        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
          setSession(session);
          queryClient.invalidateQueries(['user']);
          // Ensure we're on the home page if we have a valid session
          if (session && location.pathname === '/login') {
            navigate('/', { replace: true });
          }
          break;

        case 'INITIAL_SESSION':
          if (session) {
            setSession(session);
            queryClient.invalidateQueries(['user']);
            // Redirect to home if we're on the login page
            if (location.pathname === '/login') {
              navigate('/', { replace: true });
            }
          }
          break;
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient, navigate, location.pathname]);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      queryClient.invalidateQueries(['user']);
      queryClient.clear();
      localStorage.removeItem('supabase.auth.token');
      navigate('/login', { replace: true });
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};