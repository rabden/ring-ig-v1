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
      window.localStorage.removeItem('supabase.auth.token');
    }
  } catch (err) {
    console.error('Failed to initialize auth:', err);
    window.localStorage.removeItem('supabase.auth.token');
  }
};

// Handle OAuth redirects
const handleAuthRedirect = async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Error exchanging code for session:', error);
        return;
      }
      
      // Clear the URL parameters after successful authentication
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (err) {
    console.error('Error handling auth redirect:', err);
  }
};

// Initialize auth and handle redirects
if (typeof window !== 'undefined') {
  initializeAuth();
  handleAuthRedirect();
}