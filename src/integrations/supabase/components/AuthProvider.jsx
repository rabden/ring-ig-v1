import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const clearAuthData = () => {
    setSession(null);
    queryClient.invalidateQueries('user');
    // Clear all supabase auth related data from localStorage
    Object.keys(localStorage).forEach(key => {
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
        // If we get a 403 or session_not_found error, clear the session
        if (userError.status === 403 || userError.message?.includes('session_not_found')) {
          await supabase.auth.signOut();
          clearAuthData();
        }
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
    // Handle auth code in URL
    const params = new URLSearchParams(location.search);
    const authCode = params.get('code');
    
    if (authCode) {
      // Remove the code from URL without reloading the page
      const newUrl = window.location.pathname;
      navigate(newUrl, { replace: true });
      
      // Exchange the code for a session
      supabase.auth.exchangeCodeForSession(authCode)
        .then(({ data: { session: newSession }, error }) => {
          if (error) {
            console.error('Error exchanging code for session:', error);
            return;
          }
          if (newSession) {
            setSession(newSession);
            queryClient.invalidateQueries('user');
          }
        })
        .catch(error => {
          console.error('Error in code exchange:', error);
        });
    } else {
      handleAuthSession();
    }

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
          if (!session) {
            clearAuthData();
          }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient, location, navigate]);

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