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
