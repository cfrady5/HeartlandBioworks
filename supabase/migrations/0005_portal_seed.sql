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
