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
  const existingToken = window.localStorage.getItem('supabase.auth.token');
  if (existingToken) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error initializing auth:', error);
        window.localStorage.removeItem('supabase.auth.token');
      }
    } catch (err) {
      console.error('Failed to initialize auth:', err);
      window.localStorage.removeItem('supabase.auth.token');
    }
  }
};

initializeAuth();