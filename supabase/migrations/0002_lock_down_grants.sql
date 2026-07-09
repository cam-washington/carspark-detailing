-- Supabase auto-grants ALL privileges to anon/authenticated on new public
-- tables (independent of RLS). RLS currently masks this, but explicit
-- least-privilege grants avoid depending solely on RLS as the only barrier.

revoke all on public.leads from anon, authenticated;
revoke all on public.jobs  from anon, authenticated;

-- anon only needs to insert leads; nothing else, matching the RLS policy.
grant insert on public.leads to anon;

-- jobs: no grants for anon or authenticated at all — dashboard/service_role only.
