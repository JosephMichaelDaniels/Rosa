// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
// Replace SUPABASE_URL and SUPABASE_ANON_KEY once your project is created.
// These are public/safe to expose in a frontend app.

const SUPABASE_URL      = 'https://dnczvdrtywawkpiptkcs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuY3p2ZHJ0eXdhd2twaXB0a2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzI4NzksImV4cCI6MjA5MDEwODg3OX0.DYwBwLlraQaLEqgcYTU0RnwVW50Bz6PQv4MUc-crd4E';

// Minimal Supabase client (no npm — uses the CDN JS bundle loaded in index.html)
// Fully chainable stub so .from().select().eq().single() never throws even if unconfigured.

// Chainable query builder stub — every method returns itself; awaiting resolves immediately.
function _makeChain(data) {
  const p = Promise.resolve({ data: data !== undefined ? data : null, error: null });
  const chain = {
    select:  () => chain,   insert: () => chain,
    update:  () => chain,   delete: () => chain,
    upsert:  () => chain,   eq:     () => chain,
    neq:     () => chain,   in:     () => chain,
    order:   () => chain,   limit:  () => chain,
    single:  () => chain,   maybeSingle: () => chain,
    // Makes the chain awaitable / thenable
    then:  (res, rej) => p.then(res, rej),
    catch: (fn)       => p.catch(fn),
    finally:(fn)      => p.finally(fn),
  };
  return chain;
}

let supabase;
try {
  if (!window.supabase) throw new Error('Supabase CDN not loaded');
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} catch (e) {
  // Graceful stub — entire app works in read-only demo mode
  supabase = {
    auth: {
      signUp:                async () => ({ data: null, error: { message: 'Auth not configured.' } }),
      signInWithPassword:    async () => ({ data: null, error: { message: 'Auth not configured.' } }),
      signInWithOAuth:       async () => ({ data: null, error: { message: 'Auth not configured.' } }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
      signOut:               async () => ({}),
      getSession:            async () => ({ data: { session: null } }),
      onAuthStateChange:     (cb) => {
        try { cb('SIGNED_OUT', null); } catch(_) {}
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
    from: () => _makeChain(),
  };
}

// ─── LIVE TABLE NAMES (applied via Supabase MCP migration rosa_schema_v1) ─────
// profiles         — shared with BoundbyInk; ROSA columns added via ALTER TABLE
// rosa_sessions    — workout sessions per user
// rosa_nutrition_logs — meal logs per user
// rosa_badges      — earned badges per user
// rosa_body_stats  — weight/body-fat check-ins per user
// All tables have RLS enabled; users can only access their own rows.
