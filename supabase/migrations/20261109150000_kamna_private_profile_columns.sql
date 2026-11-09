begin;

-- profiles_public_read remains row-readable, but browser roles may select only public profile fields.
-- In particular, adult_attested_at must stay available only to the server service role.
revoke select on public.profiles from anon, authenticated;
grant select (id, handle, display_name, bio, avatar_url, created_at) on public.profiles to anon, authenticated;

commit;
