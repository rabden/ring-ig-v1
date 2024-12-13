import React, { createContext, useEffect, useState, useCallback } from 'react';
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

  const clearAuthData = useCallback(() => {
    setSession(null);
    queryClient.invalidateQueries('user');
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith('supabase.auth.') || key.startsWith('sb-'))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }, [queryClient]);

  const handleAuthSession = useCallback(async () => {
    try {
      // Try to get session from localStorage first
      const accessToken = localStorage.getItem('sb-access-token');
      const refreshToken = localStorage.getItem('sb-refresh-token');

      if (accessToken && refreshToken) {
        try {
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession({ refresh_token: refreshToken });

          if (!refreshError && refreshedSession) {
            setSession(refreshedSession);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error refreshing session:', error);
        }
      }

      // If no stored tokens or refresh failed, get current session
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth session error:', error);
        if (!error.message?.includes('fetch')) {
          clearAuthData();
        }
        return;
      }

      if (!currentSession) {
        clearAuthData();
        return;
      }

      setSession(currentSession);
    } catch (error) {
      console.error('Auth error:', error);
      if (!error.message?.includes('fetch')) {
        clearAuthData();
      }
    } finally {
      setLoading(false);
    }
  }, [clearAuthData]);

  useEffect(() => {
    // Handle auth code in URL
    const params = new URLSearchParams(location.search);
    const authCode = params.get('code');
    
    if (authCode) {
      const newUrl = window.location.pathname;
      navigate(newUrl, { replace: true });
      
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

    let authChangeTimeout;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      // Clear any pending timeout
      if (authChangeTimeout) {
        clearTimeout(authChangeTimeout);
      }

      // Debounce the state change handling
      authChangeTimeout = setTimeout(() => {
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            setSession(session);
            queryClient.invalidateQueries('user');
            break;
          case 'SIGNED_OUT':
          case 'USER_DELETED':
            clearAuthData();
            break;
          default:
            if (!session) {
              clearAuthData();
            }
        }
      }, 100);
    });

    // Auto refresh session
    const refreshInterval = setInterval(async () => {
      if (session?.refresh_token) {
        try {
          const { data: { session: refreshedSession }, error } = 
            await supabase.auth.refreshSession({ refresh_token: session.refresh_token });
          
          if (error) {
            console.error('Session refresh error:', error);
            if (!error.message?.includes('fetch')) {
              clearAuthData();
            }
            return;
          }
          
          if (refreshedSession) {
            setSession(refreshedSession);
          }
        } catch (error) {
          console.error('Error in session refresh:', error);
        }
      }
    }, 4 * 60 * 60 * 1000); // Refresh every 4 hours

    return () => {
      subscription?.unsubscribe();
      clearInterval(refreshInterval);
      if (authChangeTimeout) {
        clearTimeout(authChangeTimeout);
      }
    };
  }, [queryClient, location, navigate, handleAuthSession, clearAuthData]);

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