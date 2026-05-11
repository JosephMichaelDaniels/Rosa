// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
// Replace SUPABASE_URL and SUPABASE_ANON_KEY once your project is created.
// These are public/safe to expose in a frontend app.

const SUPABASE_URL      = 'https://dnczvdrtywawkpiptkcs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuY3p2ZHJ0eXdhd2twaXB0a2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzI4NzksImV4cCI6MjA5MDEwODg3OX0.DYwBwLlraQaLEqgcYTU0RnwVW50Bz6PQv4MUc-crd4E';

// Minimal Supabase client (no npm — uses the CDN JS bundle loaded in index.html)
// If not yet configured, all auth calls are gracefully no-ops so the UI still works.
let supabase;
try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} catch (e) {
  // Supabase not yet configured — stub so UI renders
  supabase = {
    auth: {
      signUp:                 async () => ({ data: null, error: { message: 'Supabase not configured yet.' } }),
      signInWithPassword:     async () => ({ data: null, error: { message: 'Supabase not configured yet.' } }),
      signInWithOAuth:        async () => ({ data: null, error: { message: 'Supabase not configured yet.' } }),
      resetPasswordForEmail:  async () => ({ data: null, error: null }),
      signOut:                async () => ({}),
      getSession:             async () => ({ data: { session: null } }),
      onAuthStateChange:      (cb) => { cb('SIGNED_OUT', null); return { data: { subscription: { unsubscribe: () => {} } } }; },
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
    }),
  };
}

// ─── LIVE TABLE NAMES (applied via Supabase MCP migration rosa_schema_v1) ─────
// profiles         — shared with BoundbyInk; ROSA columns added via ALTER TABLE
// rosa_sessions    — workout sessions per user
// rosa_nutrition_logs — meal logs per user
// rosa_badges      — earned badges per user
// rosa_body_stats  — weight/body-fat check-ins per user
// All tables have RLS enabled; users can only access their own rows.
