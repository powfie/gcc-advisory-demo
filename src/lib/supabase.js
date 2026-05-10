import { createClient } from '@supabase/supabase-js';
import { createMockSupabase } from './mockSupabase.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  url && anonKey ? createClient(url, anonKey) : createMockSupabase();
