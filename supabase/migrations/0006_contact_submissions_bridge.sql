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
