import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          const item = window.localStorage.getItem(key);
          return item;
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          window.localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    },
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  }
});

// Initialize auth state from localStorage
const initializeAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error initializing auth:', error);
      if (error.status !== 404) {
        window.localStorage.removeItem('supabase.auth.token');
      }
    }
    return session;
  } catch (err) {
    console.error('Failed to initialize auth:', err);
    return null;
  }
};

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    try {
      // Store both the session and a timestamp
      const sessionData = {
        session,
        timestamp: new Date().getTime()
      };
      window.localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error storing session:', error);
    }
  } else if (event === 'SIGNED_OUT') {
    try {
      // Clear all auth related data
      Object.keys(window.localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.')) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
});

// Initialize auth on load
initializeAuth();