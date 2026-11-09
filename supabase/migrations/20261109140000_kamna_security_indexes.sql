begin;

-- The profile trigger calls this function internally; clients must not invoke it as an RPC.
revoke all on function public.kamna_create_profile() from public, anon, authenticated;

-- Make the server-only data boundary explicit while keeping all client roles denied.
drop policy if exists artworks_no_client_access on public.artworks;
create policy artworks_no_client_access on public.artworks
  for all to anon, authenticated using (false) with check (false);
drop policy if exists upload_reservations_no_client_access on public.upload_reservations;
create policy upload_reservations_no_client_access on public.upload_reservations
  for all to anon, authenticated using (false) with check (false);
drop policy if exists reports_no_client_access on public.reports;
create policy reports_no_client_access on public.reports
  for all to anon, authenticated using (false) with check (false);
drop policy if exists moderation_audit_no_client_access on public.moderation_audit;
create policy moderation_audit_no_client_access on public.moderation_audit
  for all to anon, authenticated using (false) with check (false);

create index if not exists moderation_audit_actor_idx on public.moderation_audit(actor_id);
create index if not exists upload_reservations_artwork_idx on public.upload_reservations(artwork_id);

commit;
