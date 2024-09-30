// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import { useTable, useTables, useAddTable, useUpdateTable, useDeleteTable } from './hooks/useTable.js';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useTable,
  useTables,
  useAddTable,
  useUpdateTable,
  useDeleteTable
};