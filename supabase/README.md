# Heartland BioWorks — Supabase backend

The staff dashboard and the public News / Events / Media Library pages are
backed by Supabase project **heartland-bioworks** (`rxuqpprzmccaeeayweyd`,
us-east-2).

## Configuration (client)

The browser config lives in `docs/assets/supabase-config.js`:

- `url`  — the project API URL (https://rxuqpprzmccaeeayweyd.supabase.co)
- `key`  — the **publishable** key (`sb_publishable_…`). This key is safe in
  client code: Row Level Security limits anonymous visitors to reading
  Published content, and all writes require a signed-in staff session.

Never put the `service_role` key in this repo or in any client code.
To rotate the publishable key: Supabase Dashboard → Settings → API Keys,
then update `supabase-config.js`.

## Schema

`migrations/0001_content_tables_with_rls.sql` creates:

- `news_items`, `events`, `media_assets` — content tables with
  Draft/Published status, tags, and timestamps
- RLS policies: anonymous SELECT on Published rows only; authenticated
  users get full CRUD
- `set_updated_at` trigger + indexes for the public queries

## Staff accounts

Staff users live in Supabase Auth (Dashboard → Authentication → Users →
"Add user"). Keep public sign-ups disabled (Authentication → Providers →
Email → disable "Allow new users to sign up") so only invited staff can
log in. Any authenticated user can manage content; if you later need
finer roles, add a `profiles` table keyed to `auth.users` and tighten
the RLS policies to check it.

## Resilience

If Supabase is unreachable, public pages fall back to the read-only seed
content in `docs/data/*.js` so the site never renders empty. Dashboard
writes never fall back — they fail with a visible error so staff know
nothing was saved.
