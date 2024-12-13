import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
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
      // Only remove token if there's an actual error
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
  if (event === 'SIGNED_IN') {
    // Update localStorage with the new session
    window.localStorage.setItem('supabase.auth.token', JSON.stringify(session));
  } else if (event === 'SIGNED_OUT') {
    // Clear auth data on sign out
    window.localStorage.removeItem('supabase.auth.token');
  }
});

// Initialize auth on load
initializeAuth();