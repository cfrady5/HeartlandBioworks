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
