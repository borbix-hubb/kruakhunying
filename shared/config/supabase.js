// Supabase Configuration
const SUPABASE_URL = 'https://znmdqqrrwfkwjunxgleg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubWRxcXJyd2Zrd2p1bnhnbGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzU2ODQsImV4cCI6MjA2NzExMTY4NH0.FVRH7GKUVb5WZIGgwoE6jwWneBeyQPD-DRCnSRW-FvM';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;