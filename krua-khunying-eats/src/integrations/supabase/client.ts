// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xculkwyrcumnboqmuuyz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjdWxrd3lyY3VtbmJvcW11dXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzY2MjAsImV4cCI6MjA2ODA1MjYyMH0.aST9_Q3bShg2iP5Ia5AGCCJZ_BZdBfYU5fvrXTvkbeY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});