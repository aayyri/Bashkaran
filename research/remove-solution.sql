-- Im Supabase SQL Editor ausführen: bestehende Antworten bleiben ansonsten erhalten.
begin;
alter table public.research_responses drop constraint if exists valid_response;
alter table public.research_responses drop constraint if exists valid_survey;
update public.research_responses set payload = payload - 'solution' where payload ? 'solution';
alter table public.research_responses add constraint valid_response check (
 coalesce(jsonb_typeof(payload) = 'object'
 and payload->>'version' = '2' and payload->>'consent' = 'true'
 and jsonb_typeof(payload->'answers') = 'object'
 and not (payload ? 'solution')
 and octet_length(payload::text) <= 50000, false)
);
commit;
