import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: {
      getItem: (key) => {
        const value = window.localStorage.getItem(key);
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      },
      setItem: (key, value) => {
        if (typeof value === 'object') {
          window.localStorage.setItem(key, JSON.stringify(value));
        } else {
          window.localStorage.setItem(key, value);
        }
      },
      removeItem: (key) => window.localStorage.removeItem(key)
    }
  }
});