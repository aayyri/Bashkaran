-- Einmal im SQL Editor des ausgewählten Supabase-Projekts ausführen.
create table public.research_members (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.research_members enable row level security;
revoke all on public.research_members from anon, authenticated;
grant select on public.research_members to authenticated;
create policy "Member sees own membership" on public.research_members
for select to authenticated using ((select auth.uid()) = user_id);

create table public.research_interviews (
  id uuid primary key,
  owner_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft','complete')),
  payload jsonb not null check (coalesce((
    jsonb_typeof(payload) = 'object' and
    payload->>'schemaVersion' = '1' and
    payload->>'consent' = 'true' and
    jsonb_typeof(payload->'answers') = 'array' and
    jsonb_array_length(payload->'answers') = 10 and
    octet_length(payload::text) <= 250000
  ), false))
);
alter table public.research_interviews enable row level security;
revoke all on public.research_interviews from anon, authenticated;
grant select, insert, update, delete on public.research_interviews to authenticated;
create policy "Owner reads interviews" on public.research_interviews for select to authenticated
using (owner_id = (select auth.uid()) and exists(select 1 from public.research_members where user_id = (select auth.uid())));
create policy "Owner creates interviews" on public.research_interviews for insert to authenticated
with check (owner_id = (select auth.uid()) and exists(select 1 from public.research_members where user_id = (select auth.uid())));
create policy "Owner updates interviews" on public.research_interviews for update to authenticated
using (owner_id = (select auth.uid()) and exists(select 1 from public.research_members where user_id = (select auth.uid())))
with check (owner_id = (select auth.uid()) and exists(select 1 from public.research_members where user_id = (select auth.uid())));
create policy "Owner deletes interviews" on public.research_interviews for delete to authenticated
using (owner_id = (select auth.uid()) and exists(select 1 from public.research_members where user_id = (select auth.uid())));
create function public.research_timestamp() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = clock_timestamp(); return new; end;
$$;
create trigger research_interviews_timestamp before update on public.research_interviews
for each row execute function public.research_timestamp();

-- Anschliessend im Dashboard genau dein Auth-Konto anlegen und dessen UUID freigeben:
-- insert into public.research_members (user_id) values ('DEINE-AUTH-USER-UUID');
-- Öffentliche Registrierung in Auth deaktivieren. KEINE offene RLS-Policy hinzufügen.
