begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default 'creator' check (char_length(username) between 1 and 40),
  handle text not null default 'creator',
  display_name text not null default 'Creator' check (char_length(display_name) between 1 and 80),
  bio text not null default '' check (char_length(bio) <= 500),
  avatar_url text check (avatar_url is null or char_length(avatar_url) <= 2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists handle text;
alter table public.profiles add column if not exists display_name text not null default 'Creator';
update public.profiles set handle=coalesce(nullif(handle,''),'creator-'||substr(id::text,1,8)) where handle is null or handle='';
alter table public.profiles alter column handle set not null;
create unique index if not exists profiles_handle_unique on public.profiles (lower(handle));

create or replace function public.kamna_create_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
declare base_handle text; candidate text; disp text;
begin
  base_handle := lower(regexp_replace(coalesce(nullif(split_part(new.email, '@', 1), ''), 'creator'), '[^a-z0-9_-]+', '-', 'g'));
  base_handle := trim(both '-_' from base_handle);
  if base_handle = '' then base_handle := 'creator'; end if;
  disp := coalesce(nullif(new.raw_user_meta_data->>'display_name',''), nullif(new.raw_user_meta_data->>'full_name',''), initcap(replace(base_handle,'-',' ')));
  candidate := left(base_handle,45);
  if exists(select 1 from public.profiles p where lower(p.handle)=candidate) then candidate := left(base_handle,35)||'-'||substr(replace(new.id::text,'-',''),1,8); end if;
  insert into public.profiles (id, username, handle, display_name) values (new.id, left(coalesce(nullif(split_part(new.email, '@', 1), ''), 'creator'),40), candidate, left(disp,80)) on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists kamna_auth_user_profile on auth.users;
create trigger kamna_auth_user_profile after insert on auth.users for each row execute function public.kamna_create_profile();

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete restrict,
  object_key text not null unique check (char_length(object_key) <= 180),
  size_bytes bigint not null default 0 check (size_bytes between 0 and 8388608),
  cleanup_status text not null default 'none' check (cleanup_status in ('none','pending','complete')),
  title text not null check (char_length(title) between 1 and 80),
  description text not null default '' check (char_length(description) <= 600),
  tags text[] not null default '{}' check (cardinality(tags) <= 8 and array_position(tags, null) is null),
  model text check (model is null or char_length(model) <= 100),
  prompt text check (prompt is null or char_length(prompt) <= 1000),
  sensitive boolean not null default false,
  status text not null default 'pending' check (status in ('pending','approved','rejected','removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  removed_at timestamptz
);
alter table public.artworks add column if not exists size_bytes bigint not null default 0 check (size_bytes between 0 and 8388608);
alter table public.artworks add column if not exists cleanup_status text not null default 'none' check (cleanup_status in ('none','pending','complete'));
create index if not exists artworks_public_gallery_idx on public.artworks (created_at desc) where status = 'approved';
create index if not exists artworks_owner_idx on public.artworks (creator_id, created_at desc);
create index if not exists artworks_tags_idx on public.artworks using gin(tags);
create index if not exists artworks_status_created_idx on public.artworks (status, created_at);


create table if not exists public.upload_reservations (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 object_key text not null unique check (char_length(object_key) <= 180), size_bytes bigint not null check (size_bytes between 1 and 8388608),
 mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
 status text not null default 'reserved' check (status in ('reserved','finalized','expired')),
 artwork_id uuid references public.artworks(id) on delete restrict, created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '24 hours'
);
create index if not exists upload_reservations_owner_day_idx on public.upload_reservations(user_id,created_at desc);
create index if not exists upload_reservations_active_idx on public.upload_reservations(expires_at) where status='reserved';
alter table public.upload_reservations enable row level security;
revoke all on public.upload_reservations from anon, authenticated;

create or replace function public.kamna_reserve_upload(p_user_id uuid,p_object_key text,p_size_bytes bigint,p_mime_type text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare reservation_id uuid; used_bytes bigint; daily_count bigint;
begin
 if p_size_bytes < 1 or p_size_bytes > 8388608 or p_mime_type not in ('image/jpeg','image/png','image/webp') then raise exception 'invalid upload'; end if;
 perform pg_advisory_xact_lock(hashtextextended('kamna-storage-global',0));
 perform pg_advisory_xact_lock(hashtextextended('kamna-user-'||p_user_id::text,0));
 select count(*) into daily_count from public.upload_reservations where user_id=p_user_id and created_at > now()-interval '24 hours';
 if daily_count >= 5 then raise exception 'daily upload reservation limit reached'; end if;
 select coalesce((select sum(size_bytes) from public.artworks where status in ('pending','approved')) ,0)+coalesce((select sum(size_bytes) from public.upload_reservations where status='reserved' and expires_at>now()),0) into used_bytes;
 if used_bytes + p_size_bytes > 8589934592 then raise exception 'storage ceiling reached'; end if;
 insert into public.upload_reservations(user_id,object_key,size_bytes,mime_type) values(p_user_id,p_object_key,p_size_bytes,p_mime_type) returning id into reservation_id;
 return reservation_id;
end; $$;
revoke all on function public.kamna_reserve_upload(uuid,text,bigint,text) from public, anon, authenticated;
grant execute on function public.kamna_reserve_upload(uuid,text,bigint,text) to service_role;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete restrict,
  type text not null check (type in ('content','takedown')),
  category text not null check (char_length(category) between 1 and 40),
  details text check (details is null or char_length(details) <= 2000),
  contact_email text check (contact_email is null or char_length(contact_email) <= 254),
  status text not null default 'open' check (status in ('open','resolved','rejected')),
  submitter_fingerprint text not null check (submitter_fingerprint ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
create index if not exists reports_open_created_idx on public.reports (status, created_at);
create index if not exists reports_fingerprint_created_idx on public.reports (submitter_fingerprint, created_at desc);
create index if not exists reports_artwork_idx on public.reports (artwork_id, created_at desc);

create table if not exists public.moderation_audit (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid references public.artworks(id) on delete restrict,
  report_id uuid references public.reports(id) on delete restrict,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 1 and 40),
  reason text check (reason is null or char_length(reason) <= 500),
  created_at timestamptz not null default now(),
  check ((artwork_id is not null)::integer + (report_id is not null)::integer = 1)
);
create index if not exists moderation_audit_artwork_idx on public.moderation_audit (artwork_id, created_at desc);
create index if not exists moderation_audit_report_idx on public.moderation_audit (report_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.artworks enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_audit enable row level security;

revoke all on public.profiles, public.artworks, public.reports, public.moderation_audit from anon, authenticated;
grant select on public.profiles, public.artworks to anon, authenticated;
grant update (username, bio, avatar_url, updated_at) on public.profiles to authenticated;

 drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read on public.profiles for select to anon, authenticated using (true);
drop policy if exists profiles_owner_update on public.profiles;
create policy profiles_owner_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
drop policy if exists artworks_public_approved_read on public.artworks;
create policy artworks_public_approved_read on public.artworks for select to anon, authenticated using (status = 'approved');
drop policy if exists artworks_owner_read on public.artworks;
create policy artworks_owner_read on public.artworks for select to authenticated using (creator_id = (select auth.uid()));

-- No client policies or grants are intentionally defined for report/audit access or artwork writes.
commit;
