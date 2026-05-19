-- Optional Supabase/Postgres indexes for the human reviewer matching path.
-- This project uses Postgres-compatible SQL, so the same indexes can be run
-- from the Supabase SQL editor if the database is hosted on Supabase.

create index if not exists idx_users_reviewer_match
  on public.users (is_available, reputation_score desc);

create index if not exists idx_users_language_expertise
  on public.users using gin (language_expertise);

create index if not exists idx_reviews_reviewer_latest
  on public.reviews (reviewer_id, created_at desc);
