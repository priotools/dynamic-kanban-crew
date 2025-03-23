
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Default to empty strings if environment variables are not defined
// In production, these should be properly set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qpovabdidmnzxqexxbxe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwb3ZhYmRpZG1uenhxZXh4YnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MjI3NTIsImV4cCI6MjA1ODI5ODc1Mn0.8Eyt8ApnfQ9k8Rs3Kb751n1OGkEKlRS4PN2AhOi-SBo';

// Check if we have the required configuration and provide a meaningful error if not
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL and Anon Key are required. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

// Create the Supabase client with type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export a helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
