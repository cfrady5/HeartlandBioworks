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
