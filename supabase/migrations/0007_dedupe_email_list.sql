-- ============================================================
-- 0007_dedupe_email_list.sql
-- One newsletter_subscribers row per email address.
--
-- The contact form adds every consenting submitter to the email
-- list, so a person submitting the form three times produced three
-- subscriber rows. This keeps the earliest signup per email, drops
-- the later duplicates, and adds a unique index so future repeat
-- submissions no-op (the form already ignores that insert failing).
-- Idempotent: safe to re-run.
-- ============================================================

-- keep the earliest signup per email; drop later duplicates
delete from public.newsletter_subscribers dup
using public.newsletter_subscribers keep
where lower(dup.email) = lower(keep.email)
  and dup.id <> keep.id
  and (keep.created_at < dup.created_at
       or (keep.created_at = dup.created_at and keep.id < dup.id));

-- enforce one row per email from now on
create unique index if not exists newsletter_subscribers_email_uniq
  on public.newsletter_subscribers (lower(email));

-- verify: both counts should be equal
select
  count(*)                        as subscriber_rows,
  count(distinct lower(email))    as distinct_emails
from public.newsletter_subscribers;
