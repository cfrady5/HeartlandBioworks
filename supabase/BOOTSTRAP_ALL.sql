-- ============================================================
-- Heartland BioWorks — FULL DATABASE BOOTSTRAP (fresh project)
-- Paste this entire file into the Supabase SQL Editor and Run.
-- Target project: cxwlixxixgjnrblunnpa
-- Contents: migrations 0001–0005 concatenated in order.
-- ============================================================

-- ################ supabase/migrations/0001_content_tables_with_rls.sql ################

-- Heartland BioWorks — content schema + Row Level Security
-- Applied to project: heartland-bioworks (rxuqpprzmccaeeayweyd)
-- Re-runnable on a fresh project to recreate the backend.

create table public.news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  type text not null check (type in ('Press Release','Announcement','Media Mention','Update')),
  publish_date date,
  author text,
  excerpt text,
  body text,
  featured_image text,
  external_url text,
  tags text[] not null default '{}',
  status text not null default 'Draft' check (status in ('Draft','Published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  start_time text,
  end_time text,
  location text,
  event_type text check (event_type in ('Workshop','Webinar','Deadline','Info Session','Partner Event')),
  description text,
  registration_url text,
  host_organization text,
  tags text[] not null default '{}',
  status text not null default 'Draft' check (status in ('Draft','Published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  asset_type text check (asset_type in ('Logo','Photo','Report','One-Pager','Brand Asset','Video','Other')),
  description text,
  file_url text,
  thumbnail_url text,
  upload_date date,
  tags text[] not null default '{}',
  status text not null default 'Draft' check (status in ('Draft','Published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger news_items_updated before update on public.news_items
  for each row execute function public.set_updated_at();
create trigger events_updated before update on public.events
  for each row execute function public.set_updated_at();
create trigger media_assets_updated before update on public.media_assets
  for each row execute function public.set_updated_at();

-- RLS: anon reads Published only; authenticated staff full CRUD.
alter table public.news_items enable row level security;
alter table public.events enable row level security;
alter table public.media_assets enable row level security;

create policy "public read published" on public.news_items for select using (status = 'Published');
create policy "staff read all" on public.news_items for select to authenticated using (true);
create policy "staff insert" on public.news_items for insert to authenticated with check (true);
create policy "staff update" on public.news_items for update to authenticated using (true) with check (true);
create policy "staff delete" on public.news_items for delete to authenticated using (true);

create policy "public read published" on public.events for select using (status = 'Published');
create policy "staff read all" on public.events for select to authenticated using (true);
create policy "staff insert" on public.events for insert to authenticated with check (true);
create policy "staff update" on public.events for update to authenticated using (true) with check (true);
create policy "staff delete" on public.events for delete to authenticated using (true);

create policy "public read published" on public.media_assets for select using (status = 'Published');
create policy "staff read all" on public.media_assets for select to authenticated using (true);
create policy "staff insert" on public.media_assets for insert to authenticated with check (true);
create policy "staff update" on public.media_assets for update to authenticated using (true) with check (true);
create policy "staff delete" on public.media_assets for delete to authenticated using (true);

create index news_items_status_date on public.news_items (status, publish_date desc);
create index events_status_date on public.events (status, event_date asc);
create index media_assets_status on public.media_assets (status);

-- security hardening: pin search_path on the trigger function
alter function public.set_updated_at() set search_path = '';

-- ################ supabase/migrations/0002_file_uploads.sql ################

-- File-upload metadata + video-focused media library + storage buckets.
-- Applied to project: heartland-bioworks (rxuqpprzmccaeeayweyd)

alter table public.news_items rename column featured_image to featured_image_url;
alter table public.news_items
  add column featured_image_path text,
  add column attachment_url text,
  add column attachment_path text,
  add column attachment_name text,
  add column attachment_type text;

alter table public.events
  add column thumbnail_url text,
  add column thumbnail_path text,
  add column attachment_url text,
  add column attachment_path text,
  add column attachment_name text,
  add column attachment_type text;

alter table public.media_assets
  add column file_path text,
  add column file_name text,
  add column file_type text,
  add column file_size bigint,
  add column thumbnail_path text,
  add column embed_url text,
  add column duration text,
  add column is_video boolean not null default false;

alter table public.media_assets drop constraint media_assets_asset_type_check;
alter table public.media_assets add constraint media_assets_asset_type_check
  check (asset_type in ('Educational Video','Webinar Recording','Training Resource',
    'Report','One-Pager','Brand Asset','Photo','Logo','External Video','Other'));

update public.media_assets set is_video = true
  where asset_type in ('Educational Video','Webinar Recording','External Video');

-- public storage buckets for uploaded site media
insert into storage.buckets (id, name, public) values
  ('news-media','news-media', true),
  ('event-media','event-media', true),
  ('media-library','media-library', true)
on conflict (id) do nothing;

-- storage RLS: public read; authenticated staff upload/replace/delete
create policy "public read site media" on storage.objects
  for select using (bucket_id in ('news-media','event-media','media-library'));
create policy "staff upload site media" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('news-media','event-media','media-library'));
create policy "staff update site media" on storage.objects
  for update to authenticated
  using (bucket_id in ('news-media','event-media','media-library'))
  with check (bucket_id in ('news-media','event-media','media-library'));
create policy "staff delete site media" on storage.objects
  for delete to authenticated
  using (bucket_id in ('news-media','event-media','media-library'));

-- ################ supabase/migrations/0003_contacts_and_newsletter.sql ################

-- Contact form submissions + newsletter subscribers.
-- Applied to project: heartland-bioworks (rxuqpprzmccaeeayweyd)

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  job_title text not null,
  email text not null,
  country text not null,
  phone text,
  organization_name text not null,
  organization_type text check (organization_type in ('Company','Startup','University','Government','Nonprofit','Investor','Other') or organization_type is null),
  interests text[] not null default '{}',
  message text not null,
  consent boolean not null default false,
  status text not null default 'New' check (status in ('New','Contacted','Closed')),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text not null,
  organization text,
  job_title text,
  source text not null default 'Newsletter' check (source in ('Contact Form','Newsletter','Event Signup','Other')),
  consent boolean not null default true,
  status text not null default 'Active' check (status in ('Active','Unsubscribed','Bounced')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger contact_submissions_updated before update on public.contact_submissions
  for each row execute function public.set_updated_at();
create trigger newsletter_subscribers_updated before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

-- RLS: the public may SUBMIT (insert, consent required) but never read;
-- authenticated staff read and manage everything.
alter table public.contact_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "public submit contact" on public.contact_submissions
  for insert with check (consent = true);
create policy "staff read contacts" on public.contact_submissions
  for select to authenticated using (true);
create policy "staff update contacts" on public.contact_submissions
  for update to authenticated using (true) with check (true);
create policy "staff delete contacts" on public.contact_submissions
  for delete to authenticated using (true);

create policy "public subscribe" on public.newsletter_subscribers
  for insert with check (consent = true);
create policy "staff read subscribers" on public.newsletter_subscribers
  for select to authenticated using (true);
create policy "staff update subscribers" on public.newsletter_subscribers
  for update to authenticated using (true) with check (true);
create policy "staff delete subscribers" on public.newsletter_subscribers
  for delete to authenticated using (true);

create index contact_submissions_created on public.contact_submissions (created_at desc);
create index newsletter_subscribers_email on public.newsletter_subscribers (email);

-- ################ supabase/migrations/0004_portal_foundation.sql ################

-- ============================================================
-- 0004_portal_foundation.sql
-- Heartland BioWorks Employee Portal — schema, roles, RLS.
--
-- Apply to project: heartland-bioworks (rxuqpprzmccaeeayweyd)
-- Safe to run once; wrap-in-transaction friendly. Later files:
--   0005_portal_seed.sql   (programs, categories, tags, data moves)
--
-- Security model
--   * anon (public site):  INSERT inquiries ONLY via submit_inquiry()
--                          RPC; SELECT only published public content.
--   * authenticated staff: role-based via public.portal_role()
--                          (admin | editor | staff | contributor),
--                          sourced from profiles, enforced in RLS.
--   * No table trusts client-sent privileged fields: the RPC
--     whitelists inputs and coerces program/category server-side.
-- ============================================================

-- ---------- helpers ----------

create extension if not exists pgcrypto;

-- updated_at maintenance (reused by most tables)
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles & roles ----------

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  first_name  text not null default '',
  last_name   text not null default '',
  email       text not null unique,
  role        text not null default 'staff'
              check (role in ('admin','editor','staff','contributor')),
  avatar_url  text,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
for each row execute function public.tg_set_updated_at();

-- Role of the calling user ('' when anon/inactive). SECURITY DEFINER so
-- RLS policies can consult profiles without recursive policy loops.
create or replace function public.portal_role()
returns text language sql stable security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles
      where id = auth.uid() and active), '');
$$;

create or replace function public.is_portal_staff()
returns boolean language sql stable
set search_path = public
as $$ select public.portal_role() in ('admin','editor','staff','contributor'); $$;

create or replace function public.can_edit_content()
returns boolean language sql stable
set search_path = public
as $$ select public.portal_role() in ('admin','editor','contributor'); $$;

create or replace function public.can_publish()
returns boolean language sql stable
set search_path = public
as $$ select public.portal_role() in ('admin','editor'); $$;

create or replace function public.is_admin()
returns boolean language sql stable
set search_path = public
as $$ select public.portal_role() = 'admin'; $$;

-- Auto-provision a profile row when an auth user is created.
create or replace function public.tg_handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, coalesce(new.email,''),
          coalesce(new.raw_user_meta_data->>'first_name',''),
          coalesce(new.raw_user_meta_data->>'last_name',''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.tg_handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles: staff read"   on public.profiles;
drop policy if exists "profiles: self update"  on public.profiles;
drop policy if exists "profiles: admin write"  on public.profiles;
create policy "profiles: staff read" on public.profiles
  for select using (public.is_portal_staff());
create policy "profiles: self update" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid()
              and role = (select p.role from public.profiles p where p.id = auth.uid())
              and active = (select p.active from public.profiles p where p.id = auth.uid()));
create policy "profiles: admin write" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- programs & configurable inquiry categories ----------

create table if not exists public.programs (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,           -- 'general','biotrain','biolaunch','bionatsec'
  name        text not null,
  description text not null default '',
  display_order int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.inquiry_categories (
  id          uuid primary key default gen_random_uuid(),
  program_id  uuid not null references public.programs(id) on delete cascade,
  slug        text not null,
  name        text not null,
  display_order int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (program_id, slug)
);

alter table public.programs enable row level security;
alter table public.inquiry_categories enable row level security;

drop policy if exists "programs: public read"  on public.programs;
drop policy if exists "programs: admin write"  on public.programs;
create policy "programs: public read" on public.programs
  for select using (active or public.is_portal_staff());
create policy "programs: admin write" on public.programs
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "categories: public read" on public.inquiry_categories;
drop policy if exists "categories: admin write" on public.inquiry_categories;
create policy "categories: public read" on public.inquiry_categories
  for select using (active or public.is_portal_staff());
create policy "categories: admin write" on public.inquiry_categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- inquiries ----------

create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  phone         text not null default '',
  organization  text not null default '',
  job_title     text not null default '',
  program       text not null default 'general',      -- program slug (validated by RPC)
  inquiry_type  text not null default 'general',      -- category slug (validated by RPC)
  subject       text not null default '',
  message       text not null,
  source_form   text not null default 'contact',
  source_page   text not null default '',
  status        text not null default 'new'
                check (status in ('new','in_progress','waiting','follow_up','resolved','archived')),
  assigned_to   uuid references public.profiles(id) on delete set null,
  is_read       boolean not null default false,
  follow_up_at  timestamptz,
  metadata      jsonb not null default '{}'::jsonb,
  utm_source    text not null default '',
  utm_medium    text not null default '',
  utm_campaign  text not null default '',
  referrer      text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  resolved_at   timestamptz,
  search        tsvector generated always as (
    to_tsvector('simple',
      coalesce(first_name,'') || ' ' || coalesce(last_name,'') || ' ' ||
      coalesce(email,'') || ' ' || coalesce(organization,'') || ' ' ||
      coalesce(subject,'') || ' ' || coalesce(message,''))
  ) stored
);

create index if not exists inquiries_created_at_idx  on public.inquiries (created_at desc);
create index if not exists inquiries_program_idx     on public.inquiries (program);
create index if not exists inquiries_status_idx      on public.inquiries (status);
create index if not exists inquiries_assigned_idx    on public.inquiries (assigned_to);
create index if not exists inquiries_email_idx       on public.inquiries (lower(email));
create index if not exists inquiries_is_read_idx     on public.inquiries (is_read) where not is_read;
create index if not exists inquiries_search_idx      on public.inquiries using gin (search);

drop trigger if exists set_updated_at on public.inquiries;
create trigger set_updated_at before update on public.inquiries
for each row execute function public.tg_set_updated_at();

alter table public.inquiries enable row level security;

drop policy if exists "inquiries: staff read"    on public.inquiries;
drop policy if exists "inquiries: staff update"  on public.inquiries;
drop policy if exists "inquiries: admin delete"  on public.inquiries;
create policy "inquiries: staff read" on public.inquiries
  for select using (public.is_portal_staff());
create policy "inquiries: staff update" on public.inquiries
  for update using (public.is_portal_staff())
  with check (public.is_portal_staff());
create policy "inquiries: admin delete" on public.inquiries
  for delete using (public.is_admin());
-- NOTE: no INSERT policy for anon or authenticated on purpose —
-- all inserts flow through submit_inquiry() (SECURITY DEFINER).

-- ---------- notes / tags / activity ----------

create table if not exists public.inquiry_notes (
  id          uuid primary key default gen_random_uuid(),
  inquiry_id  uuid not null references public.inquiries(id) on delete cascade,
  author_id   uuid references public.profiles(id) on delete set null,
  note        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists inquiry_notes_inquiry_idx on public.inquiry_notes (inquiry_id, created_at);

drop trigger if exists set_updated_at on public.inquiry_notes;
create trigger set_updated_at before update on public.inquiry_notes
for each row execute function public.tg_set_updated_at();

create table if not exists public.tags (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  color       text not null default '#00843D',
  created_at  timestamptz not null default now()
);

create table if not exists public.inquiry_tags (
  inquiry_id  uuid not null references public.inquiries(id) on delete cascade,
  tag_id      uuid not null references public.tags(id) on delete cascade,
  primary key (inquiry_id, tag_id)
);
create index if not exists inquiry_tags_tag_idx on public.inquiry_tags (tag_id);

create table if not exists public.inquiry_activity (
  id             uuid primary key default gen_random_uuid(),
  inquiry_id     uuid not null references public.inquiries(id) on delete cascade,
  actor_id       uuid references public.profiles(id) on delete set null,
  event_type     text not null,   -- submitted|viewed|assigned|unassigned|status_changed|note_added|tag_added|tag_removed|read|unread
  previous_value text,
  new_value      text,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);
create index if not exists inquiry_activity_inquiry_idx on public.inquiry_activity (inquiry_id, created_at);

alter table public.inquiry_notes    enable row level security;
alter table public.tags             enable row level security;
alter table public.inquiry_tags     enable row level security;
alter table public.inquiry_activity enable row level security;

drop policy if exists "notes: staff read"    on public.inquiry_notes;
drop policy if exists "notes: staff insert"  on public.inquiry_notes;
drop policy if exists "notes: author update" on public.inquiry_notes;
drop policy if exists "notes: admin delete"  on public.inquiry_notes;
create policy "notes: staff read" on public.inquiry_notes
  for select using (public.is_portal_staff());
create policy "notes: staff insert" on public.inquiry_notes
  for insert with check (public.is_portal_staff() and author_id = auth.uid());
create policy "notes: author update" on public.inquiry_notes
  for update using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "notes: admin delete" on public.inquiry_notes
  for delete using (public.is_admin());

drop policy if exists "tags: staff read"   on public.tags;
drop policy if exists "tags: staff write"  on public.tags;
create policy "tags: staff read" on public.tags
  for select using (public.is_portal_staff());
create policy "tags: staff write" on public.tags
  for all using (public.is_portal_staff()) with check (public.is_portal_staff());

drop policy if exists "inquiry_tags: staff" on public.inquiry_tags;
create policy "inquiry_tags: staff" on public.inquiry_tags
  for all using (public.is_portal_staff()) with check (public.is_portal_staff());

drop policy if exists "activity: staff read"   on public.inquiry_activity;
drop policy if exists "activity: staff insert" on public.inquiry_activity;
create policy "activity: staff read" on public.inquiry_activity
  for select using (public.is_portal_staff());
create policy "activity: staff insert" on public.inquiry_activity
  for insert with check (public.is_portal_staff());

-- ---------- public submission RPC ----------
-- The ONLY write path for anonymous visitors. Validates + coerces
-- everything; honeypot + rate limit; never trusts privileged fields.

create or replace function public.submit_inquiry(
  p_first_name   text,
  p_last_name    text,
  p_email        text,
  p_message      text,
  p_phone        text default '',
  p_organization text default '',
  p_job_title    text default '',
  p_program      text default 'general',
  p_inquiry_type text default 'general',
  p_subject      text default '',
  p_source_form  text default 'contact',
  p_source_page  text default '',
  p_utm_source   text default '',
  p_utm_medium   text default '',
  p_utm_campaign text default '',
  p_referrer     text default '',
  p_metadata     jsonb default '{}'::jsonb,
  p_website      text default ''          -- honeypot: real users never fill this
) returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  v_program  text;
  v_type     text;
  v_id       uuid;
  v_recent   int;
begin
  -- honeypot: silently accept but do nothing
  if coalesce(p_website,'') <> '' then
    return gen_random_uuid();
  end if;

  -- required fields
  if coalesce(trim(p_first_name),'') = '' or coalesce(trim(p_last_name),'') = ''
     or coalesce(trim(p_message),'') = '' then
    raise exception 'Missing required fields';
  end if;
  if p_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Invalid email address';
  end if;
  if length(p_message) > 8000 or length(p_subject) > 400 then
    raise exception 'Message too long';
  end if;

  -- rate limit: max 5 submissions per email per hour
  select count(*) into v_recent from public.inquiries
   where lower(email) = lower(p_email) and created_at > now() - interval '1 hour';
  if v_recent >= 5 then
    raise exception 'Too many submissions; please try again later';
  end if;

  -- coerce program + category against configuration (never trust client)
  select pr.slug into v_program
    from public.programs pr
   where pr.slug = lower(coalesce(p_program,'general')) and pr.active;
  if v_program is null then v_program := 'general'; end if;

  select c.slug into v_type
    from public.inquiry_categories c
    join public.programs pr on pr.id = c.program_id
   where pr.slug = v_program and c.slug = lower(coalesce(p_inquiry_type,'')) and c.active;
  if v_type is null then
    select c.slug into v_type
      from public.inquiry_categories c
      join public.programs pr on pr.id = c.program_id
     where pr.slug = v_program and c.slug in ('general','other') and c.active
     order by c.slug limit 1;
  end if;
  if v_type is null then v_type := 'general'; end if;

  insert into public.inquiries
    (first_name, last_name, email, phone, organization, job_title,
     program, inquiry_type, subject, message, source_form, source_page,
     utm_source, utm_medium, utm_campaign, referrer, metadata)
  values
    (trim(p_first_name), trim(p_last_name), trim(p_email),
     left(coalesce(p_phone,''),50), left(coalesce(p_organization,''),300),
     left(coalesce(p_job_title,''),200),
     v_program, v_type, left(coalesce(p_subject,''),400), trim(p_message),
     left(coalesce(p_source_form,'contact'),100), left(coalesce(p_source_page,''),500),
     left(coalesce(p_utm_source,''),200), left(coalesce(p_utm_medium,''),200),
     left(coalesce(p_utm_campaign,''),200), left(coalesce(p_referrer,''),500),
     coalesce(p_metadata,'{}'::jsonb))
  returning id into v_id;

  insert into public.inquiry_activity (inquiry_id, event_type, new_value)
  values (v_id, 'submitted', v_program || '/' || v_type);

  return v_id;
end $$;

revoke all on function public.submit_inquiry from public;
grant execute on function public.submit_inquiry to anon, authenticated;

-- ---------- CMS: news_posts ----------

create table if not exists public.news_posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null,
  excerpt         text not null default '',
  body_html       text not null default '',
  featured_image  text not null default '',
  author_id       uuid references public.profiles(id) on delete set null,
  author_name     text not null default '',
  status          text not null default 'draft'
                  check (status in ('draft','scheduled','published','archived')),
  featured        boolean not null default false,
  published_at    timestamptz,
  seo_title       text not null default '',
  seo_description text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create unique index if not exists news_posts_slug_live_uniq
  on public.news_posts (slug) where status <> 'archived';
create index if not exists news_posts_status_idx on public.news_posts (status, published_at desc);

drop trigger if exists set_updated_at on public.news_posts;
create trigger set_updated_at before update on public.news_posts
for each row execute function public.tg_set_updated_at();

-- ---------- CMS: press_releases ----------

create table if not exists public.press_releases (
  id              uuid primary key default gen_random_uuid(),
  headline        text not null,
  slug            text not null,
  release_date    date,
  dateline        text not null default '',
  summary         text not null default '',
  body_html       text not null default '',
  featured_image  text not null default '',
  pdf_url         text not null default '',
  external_url    text not null default '',
  media_contact   text not null default '',
  status          text not null default 'draft'
                  check (status in ('draft','scheduled','published','archived')),
  published_at    timestamptz,
  seo_title       text not null default '',
  seo_description text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create unique index if not exists press_releases_slug_live_uniq
  on public.press_releases (slug) where status <> 'archived';
create index if not exists press_releases_status_idx on public.press_releases (status, published_at desc);

drop trigger if exists set_updated_at on public.press_releases;
create trigger set_updated_at before update on public.press_releases
for each row execute function public.tg_set_updated_at();

-- ---------- CMS: programs content + sections ----------

create table if not exists public.program_pages (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,      -- biotrain | biolaunch | bionatsec | hq
  title          text not null,
  eyebrow        text not null default '',
  hero_headline  text not null default '',
  hero_subhead   text not null default '',
  overview_html  text not null default '',
  cta_label      text not null default '',
  cta_url        text not null default '',
  hero_image     text not null default '',
  seo_title      text not null default '',
  seo_description text not null default '',
  published      boolean not null default true,
  updated_by     uuid references public.profiles(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.program_sections (
  id            uuid primary key default gen_random_uuid(),
  program_id    uuid not null references public.program_pages(id) on delete cascade,
  section_key   text not null default '',   -- e.g. 'biostart','cdmo_network','biocan_grants'
  heading       text not null default '',
  body_html     text not null default '',
  image_url     text not null default '',
  display_order int not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists program_sections_program_idx
  on public.program_sections (program_id, display_order);

drop trigger if exists set_updated_at on public.program_pages;
create trigger set_updated_at before update on public.program_pages
for each row execute function public.tg_set_updated_at();
drop trigger if exists set_updated_at on public.program_sections;
create trigger set_updated_at before update on public.program_sections
for each row execute function public.tg_set_updated_at();

-- ---------- CMS: resources / team / board / faqs / site_content ----------

create table if not exists public.resources (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null default '',
  category      text not null default '',
  url           text not null default '',
  file_url      text not null default '',
  program       text not null default '',
  featured      boolean not null default false,
  display_order int not null default 0,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.team_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  title         text not null default '',
  organization  text not null default '',
  bio_short     text not null default '',
  bio_full      text not null default '',
  headshot_url  text not null default '',
  linkedin_url  text not null default '',
  email         text not null default '',
  display_order int not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.board_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  title         text not null default '',
  organization  text not null default '',
  board_type    text not null default 'executive'
                check (board_type in ('executive','scientific','community')),
  display_order int not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer_html   text not null default '',
  page          text not null default 'faqs',   -- faqs | biotrain | biolaunch | bionatsec | home
  display_order int not null default 0,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.site_content (
  id            uuid primary key default gen_random_uuid(),
  key           text not null unique,          -- e.g. 'home.hero.title'
  page          text not null default '',
  section       text not null default '',
  label         text not null default '',
  content       text not null default '',
  content_type  text not null default 'text' check (content_type in ('text','html','url')),
  updated_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['resources','team_members','board_members','faqs','site_content'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I
                    for each row execute function public.tg_set_updated_at()', t);
  end loop;
end $$;

-- ---------- content activity (audit trail) ----------

create table if not exists public.content_activity (
  id            uuid primary key default gen_random_uuid(),
  actor_id      uuid references public.profiles(id) on delete set null,
  action        text not null,            -- created|updated|published|unpublished|archived|deleted
  resource_type text not null,            -- news|press_release|team_member|...
  resource_id   uuid,
  resource_name text not null default '',
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists content_activity_created_idx on public.content_activity (created_at desc);

-- ---------- RLS: CMS + audit ----------

alter table public.news_posts       enable row level security;
alter table public.press_releases   enable row level security;
alter table public.program_pages    enable row level security;
alter table public.program_sections enable row level security;
alter table public.resources        enable row level security;
alter table public.team_members     enable row level security;
alter table public.board_members    enable row level security;
alter table public.faqs             enable row level security;
alter table public.site_content     enable row level security;
alter table public.content_activity enable row level security;

-- Public read = published only (and scheduled gate published_at <= now()).
-- Staff read everything. Create/edit = admin/editor/contributor.
-- Publish/status flips + deletes = admin/editor (checked in WITH CHECK).

drop policy if exists "news: public read"   on public.news_posts;
drop policy if exists "news: staff read"    on public.news_posts;
drop policy if exists "news: create"        on public.news_posts;
drop policy if exists "news: update"        on public.news_posts;
drop policy if exists "news: delete"        on public.news_posts;
create policy "news: public read" on public.news_posts
  for select using (status = 'published' and published_at is not null and published_at <= now());
create policy "news: staff read" on public.news_posts
  for select using (public.is_portal_staff());
create policy "news: create" on public.news_posts
  for insert with check (public.can_edit_content()
    and (public.can_publish() or status = 'draft'));
create policy "news: update" on public.news_posts
  for update using (public.can_edit_content())
  with check (public.can_publish() or status = 'draft');
create policy "news: delete" on public.news_posts
  for delete using (public.can_publish());

drop policy if exists "press: public read" on public.press_releases;
drop policy if exists "press: staff read"  on public.press_releases;
drop policy if exists "press: create"      on public.press_releases;
drop policy if exists "press: update"      on public.press_releases;
drop policy if exists "press: delete"      on public.press_releases;
create policy "press: public read" on public.press_releases
  for select using (status = 'published' and published_at is not null and published_at <= now());
create policy "press: staff read" on public.press_releases
  for select using (public.is_portal_staff());
create policy "press: create" on public.press_releases
  for insert with check (public.can_edit_content()
    and (public.can_publish() or status = 'draft'));
create policy "press: update" on public.press_releases
  for update using (public.can_edit_content())
  with check (public.can_publish() or status = 'draft');
create policy "press: delete" on public.press_releases
  for delete using (public.can_publish());

do $$
declare t text;
begin
  -- simple published-flag content types share one policy shape
  foreach t in array array['program_pages','program_sections','resources','team_members','board_members','faqs'] loop
    execute format('drop policy if exists "%1$s: public read" on public.%1$I', t);
    execute format('drop policy if exists "%1$s: staff read"  on public.%1$I', t);
    execute format('drop policy if exists "%1$s: edit"        on public.%1$I', t);
    execute format('drop policy if exists "%1$s: delete"      on public.%1$I', t);
    execute format('create policy "%1$s: staff read" on public.%1$I
                      for select using (public.is_portal_staff())', t);
    execute format('create policy "%1$s: edit" on public.%1$I
                      for all using (public.can_edit_content())
                      with check (public.can_edit_content())', t);
  end loop;
end $$;

create policy "program_pages: public read" on public.program_pages
  for select using (published);
create policy "program_sections: public read" on public.program_sections
  for select using (published);
create policy "resources: public read" on public.resources
  for select using (published);
create policy "team_members: public read" on public.team_members
  for select using (active);
create policy "board_members: public read" on public.board_members
  for select using (active);
create policy "faqs: public read" on public.faqs
  for select using (published);

drop policy if exists "site_content: public read" on public.site_content;
drop policy if exists "site_content: edit"        on public.site_content;
create policy "site_content: public read" on public.site_content
  for select using (true);
create policy "site_content: edit" on public.site_content
  for all using (public.can_edit_content()) with check (public.can_edit_content());

drop policy if exists "content_activity: staff read" on public.content_activity;
drop policy if exists "content_activity: insert"     on public.content_activity;
create policy "content_activity: staff read" on public.content_activity
  for select using (public.is_portal_staff());
create policy "content_activity: insert" on public.content_activity
  for insert with check (public.is_portal_staff() and actor_id = auth.uid());

-- ---------- realtime ----------
-- (idempotent: ignore if already added)
do $$
begin
  begin
    alter publication supabase_realtime add table public.inquiries;
  exception when duplicate_object then null;
  end;
end $$;

-- ################ supabase/migrations/0005_portal_seed.sql ################

-- ============================================================
-- 0005_portal_seed.sql
-- Seed configuration + migrate legacy data into the portal schema.
-- Idempotent: safe to re-run (upserts / existence guards).
-- ============================================================

-- ---------- programs ----------
insert into public.programs (slug, name, display_order) values
  ('general',   'General',                   0),
  ('biotrain',  'BioTrain',                  1),
  ('biolaunch', 'BioLaunch',                 2),
  ('bionatsec', 'Bio for National Security', 3)
on conflict (slug) do update set name = excluded.name, display_order = excluded.display_order;

-- ---------- inquiry categories (configurable; §50) ----------
with p as (select id, slug from public.programs)
insert into public.inquiry_categories (program_id, slug, name, display_order)
select p.id, c.slug, c.name, c.ord
from p join (values
  ('general',   'general',          'General Contact',            0),
  ('general',   'partnership',      'Partnership',                1),
  ('general',   'media',            'Media',                      2),
  ('general',   'other',            'Other',                      3),
  ('biotrain',  'job_seeker',       'Job Seeker',                 0),
  ('biotrain',  'employer',         'Employer',                   1),
  ('biotrain',  'educator',         'Educator / Training Partner',2),
  ('biotrain',  'current_worker',   'Current Worker',             3),
  ('biotrain',  'other',            'Other',                      4),
  ('biolaunch', 'startup_support',  'Startup Support',            0),
  ('biolaunch', 'biostart',         'BioStart',                   1),
  ('biolaunch', 'cdmo_lab_network', 'CDMO & Lab Network',         2),
  ('biolaunch', 'biocan',           'BioCAN',                     3),
  ('biolaunch', 'biocan_grants',    'BioCAN Grants',              4),
  ('biolaunch', 'funding',          'Funding',                    5),
  ('biolaunch', 'commercialization','Commercialization',          6),
  ('biolaunch', 'other',            'Other',                      7),
  ('bionatsec', 'innovator',        'Innovator',                  0),
  ('bionatsec', 'industry',         'Industry',                   1),
  ('bionatsec', 'government',       'Government',                 2),
  ('bionatsec', 'partnership',      'Partnership',                3),
  ('bionatsec', 'other',            'Other',                      4)
) as c(pslug, slug, name, ord) on c.pslug = p.slug
on conflict (program_id, slug) do update set name = excluded.name, display_order = excluded.display_order;

-- ---------- tags ----------
insert into public.tags (name, slug, color) values
  ('Employer',   'employer',   '#0D4568'),
  ('Job Seeker', 'job-seeker', '#00843D'),
  ('Funding',    'funding',    '#8a5a00'),
  ('CDMO',       'cdmo',       '#0D5A70'),
  ('Partnership','partnership','#5b2a86'),
  ('Media',      'media',      '#a32626'),
  ('Training',   'training',   '#3EB248'),
  ('Startup',    'startup',    '#146152'),
  ('Follow Up',  'follow-up',  '#b3261e')
on conflict (slug) do nothing;

-- ---------- migrate legacy contact_submissions -> inquiries ----------
-- Column-name agnostic via to_jsonb; skips rows already migrated.
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'contact_submissions') then
    insert into public.inquiries
      (first_name, last_name, email, phone, organization, job_title,
       program, inquiry_type, subject, message, source_form, source_page,
       status, is_read, metadata, created_at)
    select
      coalesce(j->>'first_name', j->>'firstName', ''),
      coalesce(j->>'last_name',  j->>'lastName',  ''),
      coalesce(j->>'email', ''),
      coalesce(j->>'phone', ''),
      coalesce(j->>'organization_name', j->>'organization', ''),
      coalesce(j->>'job_title', j->>'jobTitle', ''),
      'general', 'general',
      '', coalesce(j->>'message', ''),
      'contact_legacy', 'contact.html',
      case lower(coalesce(j->>'status','new'))
        when 'contacted' then 'in_progress'
        when 'closed'    then 'resolved'
        else 'new' end,
      lower(coalesce(j->>'status','new')) <> 'new',
      jsonb_strip_nulls(jsonb_build_object(
        'legacy_id', j->>'id',
        'country', j->>'country',
        'organization_type', j->>'organization_type',
        'interests', j->'interests',
        'consent', j->'consent')),
      coalesce((j->>'created_at')::timestamptz, now())
    from (select to_jsonb(cs) j from public.contact_submissions cs) src
    where coalesce(j->>'email','') <> ''
      and not exists (
        select 1 from public.inquiries i
        where i.metadata->>'legacy_id' = j->>'id');

    -- carry over any legacy internal notes as a first note
    insert into public.inquiry_notes (inquiry_id, note, created_at)
    select i.id, j->>'internal_notes', coalesce((j->>'updated_at')::timestamptz, now())
    from (select to_jsonb(cs) j from public.contact_submissions cs) src
    join public.inquiries i on i.metadata->>'legacy_id' = j->>'id'
    where coalesce(j->>'internal_notes','') <> ''
      and not exists (select 1 from public.inquiry_notes n where n.inquiry_id = i.id);
  end if;
end $$;

-- ---------- migrate legacy news_items -> news_posts ----------
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'news_items') then
    insert into public.news_posts
      (title, slug, excerpt, body_html, featured_image, author_name,
       status, published_at, created_at)
    select
      coalesce(j->>'title','Untitled'),
      -- slugify title; suffix legacy id fragment to avoid collisions
      left(regexp_replace(lower(coalesce(j->>'title','untitled')), '[^a-z0-9]+', '-', 'g'), 80)
        || '-' || left(coalesce(j->>'id',''), 6),
      coalesce(j->>'summary', j->>'excerpt', ''),
      coalesce(j->>'body', j->>'content', j->>'summary', ''),
      coalesce(j->>'image_url', j->>'featured_image', ''),
      coalesce(j->>'author', ''),
      case when lower(coalesce(j->>'status','draft')) = 'published' then 'published' else 'draft' end,
      case when lower(coalesce(j->>'status','draft')) = 'published'
           then coalesce((j->>'publish_date')::timestamptz,
                         (j->>'created_at')::timestamptz, now()) end,
      coalesce((j->>'created_at')::timestamptz, now())
    from (select to_jsonb(n) j from public.news_items n) src
    where not exists (
      select 1 from public.news_posts np
      where np.slug = left(regexp_replace(lower(coalesce(j->>'title','untitled')), '[^a-z0-9]+', '-', 'g'), 80)
                     || '-' || left(coalesce(j->>'id',''), 6));
  end if;
end $$;

-- ---------- seed team_members from the current site roster ----------
insert into public.team_members
  (name, title, bio_short, bio_full, headshot_url, linkedin_url, email, display_order, active)
select * from (values
  ('Michelle Dennis', 'Regional Innovation Officer',
   'Michelle Dennis is the Regional Innovation Officer for Heartland BioWorks, leading strategy and growth for the Tech Hub. She brings a diverse background spanning federal funding strategy, university-industry partnerships, and corporate sustainability.',
   'Michelle Dennis is the Regional Innovation Officer for Heartland BioWorks, leading strategy and growth for the Tech Hub. She brings a diverse background spanning federal funding strategy, university-industry partnerships, and corporate sustainability.' || E'\n\n' ||
   'Prior to this role, Michelle served as Vice President of Proposal Management at the Applied Research Institute, where she helped secure the EDA Regional Tech Hub grant for Indiana. She also held leadership positions in proposal development and partnerships at Purdue University, Purdue Research Foundation, and Subaru of Indiana Automotive.' || E'\n\n' ||
   'Michelle holds an MA in Modernity, Literature, and Culture from University College Dublin and BAs in Management from Purdue University and English from Indiana University Bloomington.',
   'assets/team/michelle-dennis.jpg', 'https://www.linkedin.com/in/michelle-dennis-1136858a/', 'michelle.dennis@theari.us', 1, true),
  ('Dr. Kerri Dugan', 'Senior Vice President, Biotechnology Programs',
   'Dr. Kerri Dugan is the Senior Vice President for Biotechnology Programs at the Applied Research Institute. Her experience includes transitioning capabilities across broad multi-disciplinary domains including biotechnology, geospatial intelligence, forensic science, and critical technology areas in support of national security.',
   'Dr. Kerri Dugan is the Senior Vice President for Biotechnology Programs at the Applied Research Institute. Her experience includes transitioning capabilities across broad multi-disciplinary domains including biotechnology, geospatial intelligence, forensic science, and critical technology areas in support of national security.' || E'\n\n' ||
   'She held leadership positions at the National Science Foundation, DARPA, the National Geospatial-Intelligence Agency, and the Federal Bureau of Investigation Laboratory Division.' || E'\n\n' ||
   'She holds a PhD in molecular biology from Princeton University and BS and Master''s degrees in Chemistry from the College of William and Mary.',
   'assets/team/kerri-dugan.jpg', 'https://www.linkedin.com/in/kerri-dugan-2355281b8/', 'kerri.dugan@theari.us', 2, true),
  ('Anne Marie Murphy', 'Director of BioTrain',
   'Anne Marie Murphy is the Director of BioTrain for the Heartland BioWorks Tech Hub, advancing Indiana''s biomanufacturing workforce through training, industry partnerships, and statewide program development. She has led organizations through startup launches, federal program management, and multi-million-dollar regional growth initiatives.',
   'Anne Marie Murphy is the Director of BioTrain for the Heartland BioWorks Tech Hub, advancing Indiana''s biomanufacturing workforce through training, industry partnerships, and statewide program development. With experience spanning healthcare, entrepreneurship, and economic development, she has led organizations through startup launches, federal program management, and multi-million-dollar regional growth initiatives.' || E'\n\n' ||
   'Anne Marie previously held leadership roles with the Indiana Economic Development Corporation, where she directed statewide small business programs; the Northeast Indiana Regional Partnership, where she led regional economic initiatives; and the Northeast Indiana Innovation Center, where she managed federal entrepreneurial support programs.' || E'\n\n' ||
   'She holds a master''s degree in Nursing from Western Governors University and a master''s degree in Strategic Management from Indiana Wesleyan University, a bachelor''s degree in Nursing from Western Governors University and a bachelor''s degree in Biology from Pennsylvania State University, and certifications in Project Management and Equity & Inclusion.',
   'assets/team/anne-marie-murphy.jpg', 'https://www.linkedin.com/in/annemariemurphy260/', 'annemarie.murphy@theari.us', 3, true),
  ('Tyler Yoder', 'Director of BioLaunch',
   'Tyler Yoder is the Director of BioLaunch for the Heartland BioWorks Tech Hub, facilitating innovator connections to Indiana-based biomanufacturing and drug development resources. A native Hoosier, Tyler brings startup, corporate finance, and product management experience across the life sciences.',
   'Tyler Yoder is the Director of BioLaunch for the Heartland BioWorks Tech Hub, facilitating innovator connections to Indiana-based biomanufacturing and drug development resources. A native Hoosier, Tyler brings startup, corporate finance, and product management experience across the life sciences to help innovators reach their next commercialization milestone.' || E'\n\n' ||
   'He completed his BA in Business Finance at Ball State University and his full-time MBA at Indiana University Bloomington with concentrations in Marketing, Entrepreneurship, and Corporate Innovation.',
   'assets/team/tyler-yoder.jpg', 'https://www.linkedin.com/in/tyler-yoder/', 'tyler.yoder@theari.us', 4, true),
  ('Colin Zeh', 'Program Manager',
   'Colin Zeh is the Program Manager for the Heartland BioWorks Tech Hub, coordinating procurement operations, HQ project management, and strategic partnerships to advance Indiana''s biomanufacturing ecosystem. A U.S. Army veteran and Purdue ROTC alumnus, Colin brings experience spanning federal program management, managing large scale operations, strategic communications, and cross-sector partnership development across the life sciences.',
   '',
   'assets/team/ColinHeadshot.jpeg', 'https://www.linkedin.com/in/colin-zeh/', 'colin.zeh@theari.us', 5, true)
) as t(name, title, bio_short, bio_full, headshot_url, linkedin_url, email, display_order, active)
where not exists (select 1 from public.team_members tm where tm.name = t.name);

-- ---------- seed board_members (Executive Board) from the current site roster ----------
insert into public.board_members (name, title, organization, board_type, display_order, active)
select * from (values
  ('Mike Bolinder',       'SVP, External Engagement & Chief Innovation Officer',        'BioCrossroads',                                        'executive',  1, true),
  ('Susan Brock Williams','Associate Vice President, State Government Affairs',         'Eli Lilly',                                            'executive',  2, true),
  ('Tim Davies',          'Vice President, Crop Health R&D',                            'Corteva Agriscience',                                  'executive',  3, true),
  ('Daniel DeLaurentis',  'Vice President for Research',                                'Purdue University',                                    'executive',  4, true),
  ('Molly Dodge',         'Senior Vice President for Workforce and Careers',            'Ivy Tech Community College',                           'executive',  5, true),
  ('Scott Fadness',       'Mayor',                                                      'City of Fishers',                                      'executive',  6, true),
  ('John Fernandez',      'CEO',                                                        'Amplify Bloomington',                                  'executive',  7, true),
  ('Joe Hogsett',         'Mayor',                                                      'City of Indianapolis',                                 'executive',  8, true),
  ('Jon Hooker',          'President',                                                  'Central Indiana Building & Construction Trades Council','executive', 9, true),
  ('Tracey Jackson',      'Vice President of Workforce Development & Community Impact', '16 Tech Innovation District',                          'executive', 10, true),
  ('Kristin Jones',       'President & CEO',                                            'Indiana Life Sciences Association',                    'executive', 11, true),
  ('Melina Kennedy',      'CEO',                                                        'Central Indiana Corporate Partnership (CICP)',         'executive', 12, true),
  ('Andrew Kossack',      'President & CEO',                                            'Applied Research Institute (ARI)',                     'executive', 13, true),
  ('Emily Krueger',       'President & CEO',                                            '16 Tech Innovation District',                          'executive', 14, true),
  ('Cory Lewis',          'President & CEO',                                            'INCOG BioPharma Services',                             'executive', 15, true),
  ('Russell Mumper',      'Vice President for Research',                                'Indiana University',                                   'executive', 16, true),
  ('Dan Peterson',        'Vice President, Industry & Government Affairs',              'Cook Group',                                           'executive', 17, true),
  ('Jeffrey Rhoads',      'Vice President for Research',                                'University of Notre Dame',                             'executive', 18, true),
  ('John Stewart',        'Advisor, State Government and Public Affairs',               'Elanco',                                               'executive', 19, true),
  ('Christy Wright',      'CEO',                                                        'AgriNovus Indiana',                                    'executive', 20, true),
  ('Vince Wong',          'President & CEO',                                            'BioCrossroads',                                        'executive', 21, true)
) as b(name, title, organization, board_type, display_order, active)
where not exists (select 1 from public.board_members bm where bm.name = b.name);

-- ---------- seed program_pages shells ----------
insert into public.program_pages (slug, title, eyebrow, hero_headline, published) values
  ('biotrain',  'BioTrain',                  'Workforce Development',        'Building Indiana''s Biomanufacturing Workforce', true),
  ('biolaunch', 'BioLaunch',                 'Commercialization & Startups', 'From Idea to Market',                            true),
  ('bionatsec', 'Bio for National Security', 'Ecosystem Initiative',         'Biosecurity for America''s Bioeconomy',          true),
  ('hq',        'BioWorks HQ',               'Coming July 2027',             'BioWorks HQ in downtown Indianapolis',           true)
on conflict (slug) do nothing;

-- ################ supabase/migrations/0006_contact_submissions_bridge.sql ################

-- ============================================================
-- 0006_contact_submissions_bridge.sql
-- Every contact form submission must surface in the staff portal
-- inbox, which reads ONLY public.inquiries.
--
-- The contact form's primary path (submit_inquiry RPC) already
-- writes to inquiries. But its legacy fallback inserts into
-- contact_submissions, and rows there never reach the inbox after
-- the one-time 0005 migration. This bridge:
--   1. mirrors every NEW contact_submissions row into inquiries
--      via trigger (so no submission can ever be invisible), and
--   2. backfills any rows inserted since the bootstrap ran.
-- Idempotent: safe to re-run.
-- ============================================================

-- ---------- 1. mirror trigger ----------
-- SECURITY DEFINER: anon has no INSERT policy on inquiries (by design —
-- the RPC is the only public write path), so the mirror must run with
-- owner rights.
create or replace function public.tg_mirror_contact_submission()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.inquiries
    (first_name, last_name, email, phone, organization, job_title,
     program, inquiry_type, subject, message, source_form, source_page,
     status, is_read, metadata, created_at)
  values
    (new.first_name, new.last_name, new.email, coalesce(new.phone, ''),
     new.organization_name, new.job_title,
     'general', 'general', '', new.message,
     'contact_legacy', 'contact.html',
     'new', false,
     jsonb_strip_nulls(jsonb_build_object(
       'legacy_id', new.id::text,
       'country', new.country,
       'organization_type', new.organization_type,
       'interests', to_jsonb(new.interests),
       'consent', to_jsonb(new.consent))),
     coalesce(new.created_at, now()))
  returning id into v_id;

  insert into public.inquiry_activity (inquiry_id, event_type, new_value)
  values (v_id, 'submitted', 'general/general');

  return new;
end $$;

drop trigger if exists mirror_to_inquiries on public.contact_submissions;
create trigger mirror_to_inquiries
after insert on public.contact_submissions
for each row execute function public.tg_mirror_contact_submission();

-- ---------- 2. backfill rows the one-time 0005 migration missed ----------
-- Same mapping as 0005; the legacy_id guard prevents duplicates for rows
-- that were already migrated (or already mirrored by the trigger above).
insert into public.inquiries
  (first_name, last_name, email, phone, organization, job_title,
   program, inquiry_type, subject, message, source_form, source_page,
   status, is_read, metadata, created_at)
select
  cs.first_name, cs.last_name, cs.email, coalesce(cs.phone, ''),
  cs.organization_name, cs.job_title,
  'general', 'general', '', cs.message,
  'contact_legacy', 'contact.html',
  case cs.status when 'Contacted' then 'in_progress'
                 when 'Closed'    then 'resolved'
                 else 'new' end,
  cs.status <> 'New',
  jsonb_strip_nulls(jsonb_build_object(
    'legacy_id', cs.id::text,
    'country', cs.country,
    'organization_type', cs.organization_type,
    'interests', to_jsonb(cs.interests),
    'consent', to_jsonb(cs.consent))),
  cs.created_at
from public.contact_submissions cs
where not exists (
  select 1 from public.inquiries i
  where i.metadata->>'legacy_id' = cs.id::text);

-- carry over any legacy internal notes as a first note
insert into public.inquiry_notes (inquiry_id, note, created_at)
select i.id, cs.internal_notes, coalesce(cs.updated_at, now())
from public.contact_submissions cs
join public.inquiries i on i.metadata->>'legacy_id' = cs.id::text
where coalesce(cs.internal_notes, '') <> ''
  and not exists (select 1 from public.inquiry_notes n where n.inquiry_id = i.id);

-- ---------- verify ----------
-- Every contact_submissions row should now have a matching inquiry.
select
  (select count(*) from public.contact_submissions) as legacy_rows,
  (select count(*) from public.inquiries
    where metadata ? 'legacy_id')                   as mirrored_into_inbox,
  (select count(*) from public.inquiries)           as total_inbox_rows;
