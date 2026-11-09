begin;

create or replace function public.kamna_submit_report(
  p_artwork_id uuid,
  p_type text,
  p_category text,
  p_details text,
  p_contact_email text,
  p_fingerprint text
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_report_id uuid;
  v_count bigint;
begin
  if p_type not in ('content','takedown')
    or p_category not in ('prohibited-sexual-content','minor-or-ambiguous-age','non-consensual-or-deepfake','copyright-rights','unlawful-content','other')
    or p_fingerprint !~ '^[0-9a-f]{64}$'
    or char_length(coalesce(p_details,'')) > 2000
    or char_length(coalesce(p_contact_email,'')) > 254 then
    raise exception 'invalid report';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('kamna-report-' || p_fingerprint, 0));
  if not exists (
    select 1 from public.artworks a
    where a.id = p_artwork_id and a.status = 'approved'
  ) then
    raise exception 'approved artwork not found';
  end if;

  select count(*) into v_count
  from public.reports r
  where r.submitter_fingerprint = p_fingerprint
    and r.created_at > now() - interval '24 hours';
  if v_count >= 5 then raise exception 'report rate limit reached'; end if;

  select r.id into v_report_id
  from public.reports r
  where r.artwork_id = p_artwork_id
    and r.submitter_fingerprint = p_fingerprint
    and r.category = p_category
    and r.status = 'open'
  order by r.created_at desc
  limit 1;
  if v_report_id is not null then
    return jsonb_build_object('id', v_report_id, 'deduplicated', true);
  end if;

  insert into public.reports(artwork_id,type,category,details,contact_email,submitter_fingerprint)
  values(p_artwork_id,p_type,p_category,nullif(p_details,''),nullif(p_contact_email,''),p_fingerprint)
  returning id into v_report_id;
  return jsonb_build_object('id', v_report_id, 'deduplicated', false);
end;
$$;
revoke all on function public.kamna_submit_report(uuid,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.kamna_submit_report(uuid,text,text,text,text,text) to service_role;

create or replace function public.kamna_moderate_artwork(
  p_artwork_id uuid,
  p_actor_id uuid,
  p_action text,
  p_reason text
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_art public.artworks%rowtype;
  v_next_status text;
  v_cleanup text;
begin
  if p_action not in ('approve','reject','remove') or char_length(coalesce(p_reason,'')) > 500 then
    raise exception 'invalid moderation action';
  end if;
  select * into v_art from public.artworks where id = p_artwork_id for update;
  if not found then raise exception 'artwork not found'; end if;
  if v_art.status in ('removed','rejected') then raise exception 'artwork already unavailable'; end if;
  if p_action in ('approve','reject') and v_art.status <> 'pending' then
    raise exception 'only pending artwork can be reviewed';
  end if;

  if p_action = 'approve' then
    v_next_status := 'approved';
    v_cleanup := v_art.cleanup_status;
    update public.artworks set status='approved', reviewed_at=now(), updated_at=now()
      where id=p_artwork_id;
  elsif p_action = 'reject' then
    v_next_status := 'rejected';
    v_cleanup := 'pending';
    update public.artworks set status='rejected', reviewed_at=now(), removed_at=now(), cleanup_status='pending', updated_at=now()
      where id=p_artwork_id;
  else
    v_next_status := 'removed';
    v_cleanup := 'pending';
    update public.artworks set status='removed', removed_at=now(), cleanup_status='pending', updated_at=now()
      where id=p_artwork_id;
  end if;

  insert into public.moderation_audit(artwork_id,actor_id,action,reason)
  values(p_artwork_id,p_actor_id,'artwork_' || p_action,nullif(p_reason,''));
  return jsonb_build_object('id',p_artwork_id,'object_key',v_art.object_key,'status',v_next_status,'cleanup_status',v_cleanup);
end;
$$;
revoke all on function public.kamna_moderate_artwork(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.kamna_moderate_artwork(uuid,uuid,text,text) to service_role;

create or replace function public.kamna_remove_owned_artwork(
  p_user_id uuid,
  p_artwork_id uuid
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_art public.artworks%rowtype;
begin
  select * into v_art from public.artworks
  where id=p_artwork_id and creator_id=p_user_id
  for update;
  if not found or v_art.status in ('removed','rejected') then
    raise exception 'artwork not found or already unavailable';
  end if;
  update public.artworks set status='removed', removed_at=now(), cleanup_status='pending', updated_at=now()
    where id=p_artwork_id;
  insert into public.moderation_audit(artwork_id,actor_id,action,reason)
  values(p_artwork_id,p_user_id,'artwork_owner_remove','Creator requested removal');
  return jsonb_build_object('id',p_artwork_id,'object_key',v_art.object_key,'status','removed','cleanup_status','pending');
end;
$$;
revoke all on function public.kamna_remove_owned_artwork(uuid,uuid) from public, anon, authenticated;
grant execute on function public.kamna_remove_owned_artwork(uuid,uuid) to service_role;

create or replace function public.kamna_retry_cleanup(
  p_artwork_id uuid,
  p_actor_id uuid,
  p_reason text
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_art public.artworks%rowtype;
begin
  if char_length(coalesce(p_reason,'')) > 500 then raise exception 'invalid reason'; end if;
  select * into v_art from public.artworks where id=p_artwork_id for update;
  if not found or v_art.cleanup_status <> 'pending' or v_art.status not in ('removed','rejected') then
    raise exception 'no cleanup is pending';
  end if;
  insert into public.moderation_audit(artwork_id,actor_id,action,reason)
  values(p_artwork_id,p_actor_id,'cleanup_retry',nullif(p_reason,''));
  return jsonb_build_object('id',p_artwork_id,'object_key',v_art.object_key);
end;
$$;
revoke all on function public.kamna_retry_cleanup(uuid,uuid,text) from public, anon, authenticated;
grant execute on function public.kamna_retry_cleanup(uuid,uuid,text) to service_role;

create or replace function public.kamna_finish_cleanup(p_artwork_id uuid)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  update public.artworks set cleanup_status='complete', updated_at=now()
  where id=p_artwork_id and cleanup_status='pending' and status in ('removed','rejected')
  returning id into v_id;
  if v_id is null then raise exception 'pending cleanup not found'; end if;
  return jsonb_build_object('id',v_id,'cleanup_status','complete');
end;
$$;
revoke all on function public.kamna_finish_cleanup(uuid) from public, anon, authenticated;
grant execute on function public.kamna_finish_cleanup(uuid) to service_role;

create or replace function public.kamna_update_report(
  p_report_id uuid,
  p_actor_id uuid,
  p_action text,
  p_reason text
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_status text;
begin
  if p_action not in ('resolve','reject') or char_length(coalesce(p_reason,'')) > 500 then
    raise exception 'invalid report action';
  end if;
  update public.reports set status=case when p_action='resolve' then 'resolved' else 'rejected' end,
    reviewed_at=now()
  where id=p_report_id and status='open'
  returning status into v_status;
  if v_status is null then raise exception 'open report not found'; end if;
  insert into public.moderation_audit(report_id,actor_id,action,reason)
  values(p_report_id,p_actor_id,'report_' || p_action,nullif(p_reason,''));
  return jsonb_build_object('id',p_report_id,'status',v_status);
end;
$$;
revoke all on function public.kamna_update_report(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.kamna_update_report(uuid,uuid,text,text) to service_role;

commit;
