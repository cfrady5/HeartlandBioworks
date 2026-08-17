# Heartland BioWorks — Employee Portal Setup & Operations

The employee portal is a private, staff-only workspace at **`/portal.html`**
(intentionally unlinked from public navigation) that provides:

1. **Inbox / lightweight CRM** — every public form submission lands in
   program-specific inboxes with statuses, assignments, notes, tags, and a
   full activity history.
2. **CMS** — staff edit News, Press Releases, Team, Executive Board,
   Resources, FAQs, Programs, and small site-content blocks without touching
   code. Published entries appear on the public site automatically.

---

## Architecture

The public site is **static HTML/JS on GitHub Pages** (embedded in Wix
iframes) — there is no server to run middleware on. The portal follows the
same architecture as the rest of the site:

```
docs/portal.html            portal shell (login + app frame)
docs/assets/portal.css      HBW-branded portal styles
docs/assets/portal.js       auth, router, dashboard, users, activity, settings
docs/assets/portal-inbox.js inquiry inboxes + detail workflow
docs/assets/portal-cms.js   News/Press editors, media library, content CRUD
supabase/migrations/0004_portal_foundation.sql   schema + RLS + RPC
supabase/migrations/0005_portal_seed.sql         seeds + legacy data migration
```

**Security boundary = Supabase Row Level Security, not the frontend.**
The portal HTML is publicly fetchable (unavoidable on static hosting), but it
renders nothing without a valid staff session and *every row of data* is
gated in Postgres by `public.portal_role()` (see below). Anonymous visitors
can only (a) call the `submit_inquiry` RPC and (b) read published content.
They can never read inquiries, notes, drafts, profiles, or activity.

Public form submissions run through **`public.submit_inquiry(...)`** — a
`SECURITY DEFINER` Postgres function (our "server-side endpoint") that:
- validates required fields + email format + length limits,
- silently drops honeypot-filled submissions,
- rate-limits to 5/hour per email,
- coerces `program` / `inquiry_type` against the `inquiry_categories`
  configuration table (privileged fields from the browser are never trusted),
- always inserts with `status='new'`.

Rich text is edited with **Quill** and sanitized with **DOMPurify at save
time**; the stored `body_html` is what public pages render.

---

## Supabase setup

Project: **heartland-bioworks** (`cxwlixxixgjnrblunnpa`).
The portal and the public website intentionally share this one project.

**Fresh project bootstrap (one paste):** open the SQL Editor and run
**`supabase/BOOTSTRAP_ALL.sql`** — it concatenates migrations 0001–0005 in
order: legacy content tables (news_items/events/media_assets,
contact_submissions, newsletter_subscribers), the **storage buckets**
(`news-media`, `event-media`, `media-library` — public read, authenticated
write), and the full portal schema, RLS, RPC, and seed data. On an existing
project, apply only the numbered migrations you're missing instead.

0005 is idempotent; on a project that has legacy data it also migrates
`contact_submissions → inquiries` (with notes) and `news_items → news_posts`,
and seeds the current team roster into `team_members`.

**Auth settings** (Dashboard → Authentication → Sign In / Up):
- **Disable public sign-ups.** Staff are invited (below); the
  `on_auth_user_created` trigger auto-creates their `profiles` row.
- Enable email + password. Password reset emails are used by the portal's
  "Forgot password" link.

### Environment / client configuration

No secrets ship to the browser. `docs/assets/supabase-config.js` contains the
project URL and **publishable** key only (safe by design — RLS is the
boundary). The `service_role` key must never appear in this repo.

---

## Database tables

| Table | Purpose |
|---|---|
| `profiles` | staff accounts; `role` ∈ admin / editor / staff / contributor; `active` flag |
| `programs` | inbox routing: general, biotrain, biolaunch, bionatsec |
| `inquiry_categories` | configurable inquiry types per program (edit in Portal → Settings) |
| `inquiries` | all public submissions; status/assignment/read/UTM/metadata + FTS index |
| `inquiry_notes` | append-only internal notes (never public) |
| `tags` / `inquiry_tags` | reusable tags on inquiries |
| `inquiry_activity` | per-inquiry event timeline (viewed/assigned/status/note/tag) |
| `news_posts` | News CMS (draft/scheduled/published/archived, slugs, SEO) |
| `press_releases` | Press Release CMS (dateline, PDF, media contact, …) |
| `program_pages` / `program_sections` | structured program content (BioCAN lives under BioLaunch) |
| `resources`, `team_members`, `board_members`, `faqs`, `site_content` | structured site content |
| `content_activity` | audit trail for all content changes |

All tables: UUID PKs, `timestamptz` timestamps, FKs with sensible cascades,
indexes on `inquiries(created_at, program, status, assigned_to, email)`,
slug/status indexes on news & press, GIN index for inquiry full-text search.

## RLS strategy & roles

`public.portal_role()` (SECURITY DEFINER) returns the caller's role from
`profiles` (or `''` for anon/inactive). Policies:

- **anon**: SELECT only published/active public content
  (`status='published' AND published_at <= now()` for News/Press — scheduled
  posts stay invisible); execute `submit_inquiry`. **No** access to
  inquiries, notes, activity, profiles, or drafts.
- **staff** (any role): read inquiries/notes/tags/activity, update inquiry
  workflow fields, add notes (as themselves).
- **contributor**: also create/edit *draft* content (cannot publish — enforced
  by `WITH CHECK (can_publish() OR status='draft')`).
- **editor**: everything contributors can, plus publish/unpublish/delete
  content.
- **admin**: everything, plus manage profiles/roles, programs, categories,
  and delete inquiries.

## Creating the first admin

1. Dashboard → Authentication → Users → **Invite user** (their email).
2. After they accept, run in SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'person@theari.us';
   ```
3. They sign in at `/portal.html` — the Users and Settings sections unlock.

## Inviting staff

Admins: Dashboard → Authentication → Invite user. The profile row appears in
**Portal → Users** automatically; set their role there. Departing employees
are **disabled** (never deleted) so history stays attributed.

## Adding a new inquiry category

Portal → **Settings** → pick the program → type the category name → **Add**.
Forms and inboxes read categories live; no code changes. (Slug is generated
automatically; the public form's `type` URL parameter uses that slug.)

## Connecting a new website form

Point any form at the RPC:

```js
const sb = window.hbSupabaseClient();
await sb.rpc("submit_inquiry", {
  p_first_name, p_last_name, p_email, p_message,        // required
  p_program: "biolaunch",            // program slug (validated server-side)
  p_inquiry_type: "cdmo_lab_network",// category slug (validated server-side)
  p_source_form: "biolaunch_cdmo",   // free-text identifier for reporting
  p_source_page: location.pathname,
  p_website: honeypotFieldValue      // leave "" for humans
});
```

Or simply link to `contact.html?program=<slug>&type=<slug>` — the main
contact form forwards those (plus UTM parameters) automatically. Program
CTAs across biotrain/biolaunch/biocan/biodefense already do this.

## Adding another CMS content type

1. Migration: create the table (copy the shape of `resources`), enable RLS,
   add the standard `staff read` / `edit` / `public read` policies.
2. Portal: add a `makeCrud({...})` config in `portal-cms.js` (table, columns,
   fields) and a sidebar entry in `portal.js` `NAV` — ~30 lines total.
3. Public page: query the table with the anon client, filtering on the
   published flag.

## Deployment

Everything is static: commit to `main`, GitHub Pages redeploys `docs/`
automatically. Publishing content requires **no deployment at all** — public
pages query Supabase at load time (News merges CMS posts with legacy items;
Press Releases, Team, and the Executive Board are fully database-driven with
hard-coded fallbacks so the pages never break if the service is unreachable).

## Testing checklist (§55)

- Auth: `/portal.html` renders login only; bad password → clear error; a
  deactivated profile is signed out with an explanation; logout works.
- Submissions: submit General + BioTrain job-seeker/employer +
  BioLaunch CDMO/funding + Bio for National Security test forms → each
  appears in All Inquiries and its program inbox with the right category.
- Filtering: program / status / date range / name / organization / assignee /
  tag / read-unread / sort, plus full-text search.
- Workflow: assign (incl. "Assign to me"), status change, notes persist,
  activity timeline records each action, unread badge updates, bulk actions.
- CMS: a draft article is not on the public News page; publishing makes it
  appear; edits update it; a scheduled article stays hidden until its time;
  Press Releases behave identically; images upload to Storage.
- Security (as anon, e.g. via curl with the publishable key):
  `select` on `inquiries`, `inquiry_notes`, `profiles`, `inquiry_activity`,
  `content_activity` → zero rows / denied; `news_posts` returns only
  published rows.
