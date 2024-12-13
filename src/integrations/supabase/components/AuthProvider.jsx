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
    try {
      // Clear all supabase auth related data from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const handleAuthSession = async () => {
    try {
      // First try to get session from localStorage
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (storedSession) {
        try {
          const { session: parsedSession, timestamp } = JSON.parse(storedSession);
          // Check if stored session is less than 7 days old
          if (parsedSession && timestamp && (new Date().getTime() - timestamp) < 7 * 24 * 60 * 60 * 1000) {
            setSession(parsedSession);
          }
        } catch (error) {
          console.error('Error parsing stored session:', error);
        }
      }

      // Then verify with Supabase
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
        if (userError.status === 403 || userError.message?.includes('session_not_found')) {
          await supabase.auth.signOut();
          clearAuthData();
        }
        return;
      }

      setSession(currentSession);
      
      // Update stored session timestamp
      try {
        const sessionData = {
          session: currentSession,
          timestamp: new Date().getTime()
        };
        localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
      } catch (error) {
        console.error('Error updating session timestamp:', error);
      }
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
            // Store the new session
            try {
              const sessionData = {
                session: newSession,
                timestamp: new Date().getTime()
              };
              localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
            } catch (error) {
              console.error('Error storing new session:', error);
            }
          }
        })
        .catch(error => {
          console.error('Error in code exchange:', error);
        });
    } else {
      handleAuthSession();
    }

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
          setSession(session);
          queryClient.invalidateQueries('user');
          try {
            const sessionData = {
              session,
              timestamp: new Date().getTime()
            };
            localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
          } catch (error) {
            console.error('Error updating session on state change:', error);
          }
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
    });

    // Auto refresh session
    const refreshInterval = setInterval(async () => {
      try {
        const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('Session refresh error:', error);
          return;
        }
        if (refreshedSession) {
          setSession(refreshedSession);
        }
      } catch (error) {
        console.error('Error in session refresh:', error);
      }
    }, 4 * 60 * 60 * 1000); // Refresh every 4 hours

    return () => {
      subscription?.unsubscribe();
      clearInterval(refreshInterval);
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