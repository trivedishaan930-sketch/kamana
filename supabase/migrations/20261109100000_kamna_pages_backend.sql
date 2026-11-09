begin;

alter table public.profiles add column if not exists adult_attested_at timestamptz;

alter table public.artworks add column if not exists provenance_id uuid;
update public.artworks set provenance_id=gen_random_uuid() where provenance_id is null;
alter table public.artworks alter column provenance_id set default gen_random_uuid();
alter table public.artworks alter column provenance_id set not null;
create unique index if not exists artworks_provenance_id_unique on public.artworks(provenance_id);
alter table public.artworks add column if not exists category text not null default 'general-illustration';
alter table public.artworks add column if not exists style text not null default 'other';
alter table public.artworks add column if not exists audience_rating text not null default 'general';
alter table public.artworks add column if not exists ai_generated boolean not null default true;
alter table public.artworks add column if not exists ai_tool text;
alter table public.artworks add column if not exists ai_model text;
alter table public.artworks add column if not exists ai_prompt text;
alter table public.artworks add column if not exists rights_disclosure text not null default 'Uploader confirms rights to publish';
alter table public.artworks add column if not exists ai_disclosure text not null default 'AI-generated; uploader-confirmed';

alter table public.artworks drop constraint if exists artworks_category_allowed;
alter table public.artworks add constraint artworks_category_allowed check(category in ('general-illustration','festival-celebration','nature-wildlife','fantasy-mythology','portrait-character','fashion-editorial','architecture-places','abstract-experimental','indian-folk-traditional','adult-fashion-swimwear'));
alter table public.artworks drop constraint if exists artworks_style_allowed;
alter table public.artworks add constraint artworks_style_allowed check(style in ('madhubani','warli','gond','odisha-pattachitra','rajasthani-phad','kalamkari-srikalahasti','kalamkari-machilipatnam-pedana','cheriyal','thanjavur-tanjore','other'));
alter table public.artworks drop constraint if exists artworks_audience_rating_allowed;
alter table public.artworks add constraint artworks_audience_rating_allowed check(audience_rating in ('general','adult'));
alter table public.artworks drop constraint if exists artworks_adult_category_rating;
alter table public.artworks add constraint artworks_adult_category_rating check((category='adult-fashion-swimwear')=(audience_rating='adult'));
alter table public.artworks drop constraint if exists artworks_ai_generated_true;
alter table public.artworks add constraint artworks_ai_generated_true check(ai_generated=true);
alter table public.artworks drop constraint if exists artworks_ai_tool_len;
alter table public.artworks add constraint artworks_ai_tool_len check(ai_tool is null or char_length(ai_tool)<=100);
alter table public.artworks drop constraint if exists artworks_ai_model_len;
alter table public.artworks add constraint artworks_ai_model_len check(ai_model is null or char_length(ai_model)<=100);
alter table public.artworks drop constraint if exists artworks_ai_prompt_len;
alter table public.artworks add constraint artworks_ai_prompt_len check(ai_prompt is null or char_length(ai_prompt)<=1000);
alter table public.artworks drop constraint if exists artworks_rights_disclosure_len;
alter table public.artworks add constraint artworks_rights_disclosure_len check(char_length(rights_disclosure) between 1 and 200);
alter table public.artworks drop constraint if exists artworks_ai_disclosure_len;
alter table public.artworks add constraint artworks_ai_disclosure_len check(char_length(ai_disclosure) between 1 and 200);
create index if not exists artworks_category_rating_public_idx on public.artworks(category,audience_rating,created_at desc) where status='approved';
create index if not exists artworks_style_idx on public.artworks(style) where status='approved';

-- Adult assets are only surfaced by authenticated server routes; direct client table reads are disabled.
revoke select on public.artworks from anon, authenticated;
drop policy if exists artworks_public_approved_read on public.artworks;
drop policy if exists artworks_owner_read on public.artworks;
revoke insert,update,delete on public.artworks, public.upload_reservations, public.reports, public.moderation_audit from anon,authenticated;

create or replace function public.kamna_finalize_upload(
 p_user_id uuid,p_object_key text,p_size_bytes bigint,p_title text,p_description text,p_tags text[],p_category text,p_style text,p_rating text,p_ai_tool text,p_ai_model text,p_ai_prompt text,p_sensitive boolean,p_provenance_id uuid,p_rights_disclosure text,p_ai_disclosure text
) returns jsonb language plpgsql security definer set search_path='' as $$
declare rid uuid; aid uuid; result jsonb;
begin
 if p_size_bytes<1 or p_size_bytes>8388608 or p_category not in ('general-illustration','festival-celebration','nature-wildlife','fantasy-mythology','portrait-character','fashion-editorial','architecture-places','abstract-experimental','indian-folk-traditional','adult-fashion-swimwear') or p_style not in ('madhubani','warli','gond','odisha-pattachitra','rajasthani-phad','kalamkari-srikalahasti','kalamkari-machilipatnam-pedana','cheriyal','thanjavur-tanjore','other') or p_rating not in ('general','adult') then raise exception 'invalid artwork metadata'; end if;
 if (p_category='adult-fashion-swimwear')<>(p_rating='adult') then raise exception 'adult category/rating mismatch'; end if;
 if p_title is null or char_length(p_title) not between 1 and 80 or char_length(coalesce(p_description,''))>600 or cardinality(coalesce(p_tags,'{}'))>8 or char_length(coalesce(p_ai_tool,''))>100 or char_length(coalesce(p_ai_model,''))>100 or char_length(coalesce(p_ai_prompt,''))>1000 then raise exception 'invalid artwork fields'; end if;
 select id into rid from public.upload_reservations where user_id=p_user_id and object_key=p_object_key and status='reserved' and expires_at>now() and size_bytes=p_size_bytes for update;
 if rid is null then raise exception 'upload reservation missing or expired'; end if;
 insert into public.artworks(creator_id,object_key,size_bytes,title,description,tags,model,prompt,sensitive,status,provenance_id,category,style,audience_rating,ai_generated,ai_tool,ai_model,ai_prompt,rights_disclosure,ai_disclosure)
 values(p_user_id,p_object_key,p_size_bytes,p_title,coalesce(p_description,''),coalesce(p_tags,'{}'),p_ai_model,p_ai_prompt,p_sensitive,'pending',p_provenance_id,p_category,p_style,p_rating,true,p_ai_tool,p_ai_model,p_ai_prompt,p_rights_disclosure,p_ai_disclosure) returning id into aid;
 update public.upload_reservations set status='finalized',artwork_id=aid where id=rid;
 select jsonb_build_object('id',a.id,'provenance_id',a.provenance_id,'status',a.status,'created_at',a.created_at) into result from public.artworks a where a.id=aid;
 return result;
end; $$;
revoke all on function public.kamna_finalize_upload(uuid,text,bigint,text,text,text[],text,text,text,text,text,text,boolean,uuid,text,text) from public,anon,authenticated;
grant execute on function public.kamna_finalize_upload(uuid,text,bigint,text,text,text[],text,text,text,text,text,text,boolean,uuid,text,text) to service_role;

-- Supabase Storage replaces the unavailable R2 binding. No client storage policies are granted.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('kamna-art','kamna-art',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=8388608,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

create or replace function public.kamna_reserve_upload(p_user_id uuid,p_object_key text,p_size_bytes bigint,p_mime_type text)
returns uuid language plpgsql security definer set search_path='' as $$
declare reservation_id uuid; used_bytes bigint; daily_count bigint;
begin
 if p_size_bytes<1 or p_size_bytes>8388608 or p_mime_type not in ('image/jpeg','image/png','image/webp') then raise exception 'invalid upload'; end if;
 perform pg_advisory_xact_lock(hashtextextended('kamna-storage-global',0));
 perform pg_advisory_xact_lock(hashtextextended('kamna-user-'||p_user_id::text,0));
 select count(*) into daily_count from public.upload_reservations where user_id=p_user_id and created_at>now()-interval '24 hours';
 if daily_count>=5 then raise exception 'daily upload reservation limit reached'; end if;
 select coalesce((select sum(size_bytes) from public.artworks where status in ('pending','approved') or cleanup_status='pending'),0)+coalesce((select sum(size_bytes) from public.upload_reservations where status='reserved' and expires_at>now()),0) into used_bytes;
 if used_bytes+p_size_bytes>786432000 then raise exception 'storage ceiling reached'; end if;
 insert into public.upload_reservations(user_id,object_key,size_bytes,mime_type) values(p_user_id,p_object_key,p_size_bytes,p_mime_type) returning id into reservation_id;
 return reservation_id;
end; $$;
revoke all on function public.kamna_reserve_upload(uuid,text,bigint,text) from public,anon,authenticated;
grant execute on function public.kamna_reserve_upload(uuid,text,bigint,text) to service_role;

commit;
