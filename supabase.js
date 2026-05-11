// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
// Replace SUPABASE_URL and SUPABASE_ANON_KEY once your project is created.
// These are public/safe to expose in a frontend app.

const SUPABASE_URL      = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

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

// ─── DATABASE SCHEMA (run in Supabase SQL editor) ─────────────────────────────
/*
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  full_name       text,
  avatar_url      text,
  streak          int default 0,
  last_active     date,
  programme_id    text,
  programme_week  int default 1,
  programme_progress float default 0,
  life_stage      text,
  goals           text[],
  diet_type       text default 'omnivore',
  allergies       text[],
  height_cm       float,
  weight_kg       float,
  body_type       text,
  kcal_target     int default 1800,
  protein_target  int default 125,
  carbs_target    int default 180,
  fat_target      int default 60,
  gdpr_consent    boolean default false,
  gdpr_date       timestamptz,
  marketing_consent boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Workout sessions
create table public.sessions (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade,
  programme_id  text,
  session_name  text,
  week          int,
  day           int,
  duration_mins int,
  completed_at  timestamptz default now(),
  exercises     jsonb
);

-- Nutrition logs
create table public.nutrition_logs (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  meal_name   text,
  meal_id     int,
  kcal        int,
  protein     float,
  carbs       float,
  fat         float,
  portions    float default 1,
  logged_at   timestamptz default now()
);

-- Badges earned
create table public.badges (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  badge_id    text,
  earned_at   timestamptz default now()
);

-- Row Level Security
alter table public.profiles       enable row level security;
alter table public.sessions       enable row level security;
alter table public.nutrition_logs enable row level security;
alter table public.badges         enable row level security;

-- RLS policies: users can only access their own data
create policy "Own profile" on public.profiles       for all using (auth.uid() = id);
create policy "Own sessions" on public.sessions      for all using (auth.uid() = user_id);
create policy "Own nutrition" on public.nutrition_logs for all using (auth.uid() = user_id);
create policy "Own badges"   on public.badges        for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, gdpr_consent, gdpr_date, marketing_consent)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'gdpr_consent')::boolean,
    (new.raw_user_meta_data->>'gdpr_date')::timestamptz,
    (new.raw_user_meta_data->>'marketing_consent')::boolean
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
*/
