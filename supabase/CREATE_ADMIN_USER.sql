-- ============================================================
-- Create the first Heartland BioWorks portal admin.
--
--   Sign in at /portal.html with:
--     email:     caleb.frady@theari.us
--     password:  Test2026
--
-- RUN THIS *AFTER* BOOTSTRAP_ALL.sql — it depends on the profiles
-- table and the on_auth_user_created trigger created there.
--
-- Safe to re-run: if the user already exists it only re-applies the
-- password and admin role rather than creating a duplicate.
-- ============================================================

-- pgcrypto lives in "extensions" on Supabase, but 0004 may also have
-- installed it into public — include both so crypt()/gen_salt() resolve.
set search_path = public, extensions;

do $$
declare
  v_email   text := 'caleb.frady@theari.us';
  v_pass    text := 'Test2026';
  v_user_id uuid;
begin
  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    ------------------------------------------------------------------
    -- create the auth user
    ------------------------------------------------------------------
    v_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated',
      v_email, crypt(v_pass, gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"first_name":"Caleb","last_name":"Frady"}'::jsonb,
      '', '', '', ''
    );

    -- GoTrue also needs a matching identity row for email/password login
    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_user_id,
      jsonb_build_object(
        'sub', v_user_id::text,
        'email', v_email,
        'email_verified', true,
        'phone_verified', false),
      'email', v_user_id::text,
      now(), now(), now()
    );

    raise notice 'Created auth user % (%)', v_email, v_user_id;
  else
    -- already exists: just (re)set the password so it matches this script
    update auth.users
       set encrypted_password = crypt(v_pass, gen_salt('bf')),
           email_confirmed_at = coalesce(email_confirmed_at, now()),
           updated_at         = now()
     where id = v_user_id;
    raise notice 'User % already existed — password reset', v_email;
  end if;

  ------------------------------------------------------------------
  -- grant portal admin (profiles row is auto-created by the
  -- on_auth_user_created trigger from migration 0004)
  ------------------------------------------------------------------
  insert into public.profiles (id, email, first_name, last_name, role, active)
  values (v_user_id, v_email, 'Caleb', 'Frady', 'admin', true)
  on conflict (id) do update
    set role       = 'admin',
        active     = true,
        first_name = coalesce(nullif(public.profiles.first_name, ''), 'Caleb'),
        last_name  = coalesce(nullif(public.profiles.last_name,  ''), 'Frady');
end $$;

-- Confirm it worked — should return one row with role = admin
select p.email, p.first_name, p.last_name, p.role, p.active, u.email_confirmed_at
  from public.profiles p
  join auth.users u on u.id = p.id
 where p.email = 'caleb.frady@theari.us';
