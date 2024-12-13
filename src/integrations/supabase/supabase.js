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
          // Also store the raw session data
          if (key === 'supabase.auth.token') {
            try {
              const parsed = JSON.parse(value);
              if (parsed?.access_token) {
                window.localStorage.setItem('sb-access-token', parsed.access_token);
                window.localStorage.setItem('sb-refresh-token', parsed.refresh_token);
              }
            } catch (e) {
              console.error('Error parsing token data:', e);
            }
          }
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          window.localStorage.removeItem(key);
          if (key === 'supabase.auth.token') {
            window.localStorage.removeItem('sb-access-token');
            window.localStorage.removeItem('sb-refresh-token');
          }
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    },
    storageKey: 'supabase.auth.token',
    flowType: 'pkce',
    debug: true
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Initialize auth state from localStorage
const initializeAuth = async () => {
  try {
    // Check if we have a valid session in localStorage first
    const storedToken = window.localStorage.getItem('sb-access-token');
    const refreshToken = window.localStorage.getItem('sb-refresh-token');
    
    if (storedToken && refreshToken) {
      // Try to refresh the session
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });
      
      if (refreshError) {
        console.error('Error refreshing session:', refreshError);
        // Only clear if it's not a network error
        if (!refreshError.message?.includes('fetch')) {
          clearAuthData();
        }
        return null;
      }
      
      if (session) {
        return session;
      }
    }

    // If no stored token or refresh failed, try getting current session
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error initializing auth:', error);
      if (error.status !== 404 && !error.message?.includes('fetch')) {
        clearAuthData();
      }
    }
    return session;
  } catch (err) {
    console.error('Failed to initialize auth:', err);
    return null;
  }
};

const clearAuthData = () => {
  try {
    Object.keys(window.localStorage)
      .filter(key => key.startsWith('supabase.auth.') || key.startsWith('sb-'))
      .forEach(key => window.localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

let authChangeDebounceTimeout;

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, 'Session:', session ? 'exists' : 'null');
  
  // Clear any pending timeout
  if (authChangeDebounceTimeout) {
    clearTimeout(authChangeDebounceTimeout);
  }

  // Debounce the state change handling
  authChangeDebounceTimeout = setTimeout(() => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      try {
        if (session?.access_token) {
          window.localStorage.setItem('sb-access-token', session.access_token);
          if (session.refresh_token) {
            window.localStorage.setItem('sb-refresh-token', session.refresh_token);
          }
        }
      } catch (error) {
        console.error('Error storing session:', error);
      }
    } else if (event === 'SIGNED_OUT') {
      clearAuthData();
    }
  }, 100); // Debounce for 100ms
});

// Initialize auth on load
initializeAuth();