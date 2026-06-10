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
