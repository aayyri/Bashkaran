-- Nach schema.sql ausführen. Bisherige Interviews bleiben unverändert.
create table if not exists public.research_responses (
 id uuid primary key,
 created_at timestamptz not null default now(),
 payload jsonb not null,
 constraint valid_survey check (coalesce(
   jsonb_typeof(payload)='object' and payload->>'version'='2'
   and payload->>'consent'='true' and jsonb_typeof(payload->'answers')='object'
   and (payload->'answers') ?& array['search','platforms','applications','difficulty','problems','last','repeat','status','priority','anything']
   and octet_length(payload::text)<=50000,false))
);
alter table public.research_responses enable row level security;
revoke all on public.research_responses from anon, authenticated;
grant insert(id,payload) on public.research_responses to anon;
grant select, delete on public.research_responses to authenticated;
create policy "Anonymous submission only" on public.research_responses for insert to anon with check (true);
create policy "Members read survey" on public.research_responses for select to authenticated using (exists(select 1 from public.research_members where user_id=auth.uid()));
create policy "Members delete survey" on public.research_responses for delete to authenticated using (exists(select 1 from public.research_members where user_id=auth.uid()));
