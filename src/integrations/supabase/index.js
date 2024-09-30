import { supabase } from './supabase';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth';
import { useTable, useTables, useAddTable, useUpdateTable, useDeleteTable } from './hooks/useTable';

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