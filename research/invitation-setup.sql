-- Einmal im Supabase SQL Editor ausführen. Keine bestehenden Problemantworten werden gelöscht.
begin;
alter table public.research_responses drop constraint if exists valid_response;
alter table public.research_responses drop constraint if exists valid_survey;
update public.research_responses set payload = payload - 'solution' where payload ? 'solution';
alter table public.research_responses add constraint valid_response check (
 coalesce(jsonb_typeof(payload)='object' and payload->>'version'='2'
 and payload->>'consent'='true' and jsonb_typeof(payload->'answers')='object'
 and not (payload ? 'solution') and octet_length(payload::text)<=50000,false)
);
-- Direkte Einsendungen bleiben verboten. Nur die geprüfte Funktion darf schreiben.
revoke insert, update on public.research_responses from anon, authenticated;
revoke insert(id,payload) on public.research_responses from anon, authenticated;
create table public.research_invites (
 token uuid primary key default gen_random_uuid(),
 expires_at timestamptz not null default now()+interval '30 days',
 used_submission uuid
);
alter table public.research_invites enable row level security;
revoke all on public.research_invites from anon, authenticated;
create function public.create_research_invite() returns uuid
language plpgsql security definer set search_path='' as $fn$
declare result uuid;
begin
 if not exists(select 1 from public.research_members where user_id=auth.uid()) then
  raise exception 'Not allowed' using errcode='42501';
 end if;
 insert into public.research_invites default values returning token into result;
 return result;
end $fn$;
revoke all on function public.create_research_invite() from public,anon,authenticated;
grant execute on function public.create_research_invite() to authenticated;

create function public.submit_research_response(invitation uuid, submission uuid, answer jsonb)
returns uuid language plpgsql security definer set search_path='' as $fn$
declare ticket public.research_invites%rowtype; q jsonb; a jsonb; v jsonb;
 definitions constant jsonb := $questions$[{"id":"search","title":"Wo suchen Sie aktuell nach Wohnungen?","multi":true,"options":["Immobilienportale","Websites von Verwaltungen / Maklern","Social Media","Freunde / Familie / Bekannte","Andere Wege","Ich suche aktuell nicht"],"exclusive":"Ich suche aktuell nicht","free":"Andere Wege oder Ergänzungen"},{"id":"platforms","title":"Auf wie vielen Plattformen suchen Sie gleichzeitig?","options":["Keine","1","2–3","4–5","Mehr als 5","Weiss ich nicht"]},{"id":"applications","title":"Wie viele Wohnungsbewerbungen haben Sie in den letzten drei Monaten verschickt?","options":["Keine","1–2","3–5","6–10","Mehr als 10","Weiss ich nicht"]},{"id":"difficulty","title":"Wie erleben Sie die Wohnungssuche insgesamt?","options":["Sehr einfach","Eher einfach","Weder einfach noch schwierig","Eher schwierig","Sehr schwierig","Kann ich nicht beurteilen"]},{"id":"problems","title":"Was hat Ihnen bei Ihrer bisherigen Suche Schwierigkeiten bereitet?","multi":true,"options":["Passende Wohnungen finden","Unvollständige / unklare Inserate","Besichtigungstermine vereinbaren","Bewerbung ausfüllen","Angaben mehrfach eingeben","Unterlagen beschaffen / hochladen","Lange Wartezeiten","Fehlende Rückmeldungen","Unklarer Bewerbungsstatus","Bedienung auf dem Handy","Vertrauen in Inserate","Umgang mit persönlichen Daten","Etwas anderes","Nichts davon"],"exclusive":"Nichts davon","free":"Was genau war schwierig? Ein konkretes Beispiel hilft uns."},{"id":"last","title":"Wie haben Sie Ihre letzte Wohnungsbewerbung eingereicht?","options":["Onlineformular / Bewerbungsportal","E-Mail","Papier / persönlich","Anderer Weg","Noch nie beworben","Weiss ich nicht mehr"],"free":"Wenn Sie möchten: Wie lief die letzte Bewerbung ab?"},{"id":"repeat","title":"Welche Angaben oder Unterlagen mussten Sie bei verschiedenen Bewerbungen erneut einreichen?","multi":true,"options":["Persönliche Angaben","Angaben zu Arbeit / Einkommen","Betreibungsregisterauszug","Lohnnachweise","Referenzen","Andere Angaben / Unterlagen","Keine","Bisher keine oder nur eine Bewerbung"],"exclusive":["Keine","Bisher keine oder nur eine Bewerbung"],"free":"Ergänzungen – bitte keine Dokumente oder persönlichen Daten einfügen."},{"id":"status","title":"Wussten Sie nach dem Abschicken, wie der Stand Ihrer Bewerbung war?","options":["Immer","Meistens","Manchmal","Selten","Nie","Noch keine Bewerbung verschickt"],"free":"Wie wurden Sie informiert – oder welche Information fehlte?"},{"id":"priority","title":"Wenn Sie nur eine Sache verbessern könnten: Welche wäre das?","options":["Passende Wohnungen finden","Bessere Informationen im Inserat","Einfachere Besichtigungstermine","Einfachere Bewerbung","Weniger wiederholte Eingaben / Unterlagen","Schnellere Rückmeldungen","Klarer Bewerbungsstatus","Bessere mobile Bedienung","Mehr Vertrauen / Datenschutz","Etwas anderes","Ich würde nichts ändern"],"free":"Warum gerade diese Sache?"},{"id":"anything","title":"Was möchten Sie uns sonst noch mitgeben?","free":"Weitere Erfahrungen, Wünsche oder ein konkretes Erlebnis","onlyText":true}]$questions$;
begin
 select * into ticket from public.research_invites where token=invitation for update;
 if not found then raise exception 'Invitation unavailable'; end if;
 -- Wiederholungen nach einer unterbrochenen Verbindung erzeugen keine doppelte Antwort.
 if ticket.used_submission is not null then
  if ticket.used_submission=submission then return submission; end if;
  raise exception 'Invitation unavailable';
 end if;
 if ticket.expires_at<now() or submission is null then raise exception 'Invitation unavailable'; end if;
 if answer is null or jsonb_typeof(answer)<>'object' or octet_length(answer::text)>50000
  or answer->'version' is distinct from '2'::jsonb or answer->'consent' is distinct from 'true'::jsonb
  or jsonb_typeof(answer->'answers') is distinct from 'object'
  or (select count(*) from jsonb_object_keys(answer))<>3 then raise exception 'Invalid answer'; end if;
 if (select count(*) from jsonb_object_keys(answer->'answers'))<>10 then raise exception 'Invalid answer'; end if;
 for q in select value from jsonb_array_elements(definitions) loop
  a:=answer->'answers'->(q->>'id');
  if a is null or jsonb_typeof(a)<>'object' then raise exception 'Invalid answer'; end if;
  if (select count(*) from jsonb_object_keys(a))<>2
   or jsonb_typeof(a->'values') is distinct from 'array'
   or jsonb_typeof(a->'text') is distinct from 'string'
   or char_length(a->>'text')>3000 then raise exception 'Invalid answer'; end if;
  if not coalesce((q->>'multi')::boolean,false) and jsonb_array_length(a->'values')>1 then raise exception 'Invalid answer'; end if;
  if (select count(distinct value) from jsonb_array_elements(a->'values'))<>jsonb_array_length(a->'values') then raise exception 'Invalid answer'; end if;
  for v in select value from jsonb_array_elements(a->'values') loop
   if jsonb_typeof(v)<>'string' or not coalesce((q->'options') @> jsonb_build_array(v),false) then raise exception 'Invalid answer'; end if;
   if jsonb_array_length(a->'values')>1 and
     ((q->'exclusive')=v or (jsonb_typeof(q->'exclusive')='array' and (q->'exclusive') @> jsonb_build_array(v)))
    then raise exception 'Invalid answer'; end if;
  end loop;
 end loop;
 insert into public.research_responses(id,payload) values(submission,answer);
 update public.research_invites set used_submission=submission where token=invitation;
 return submission;
end $fn$;
revoke all on function public.submit_research_response(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.submit_research_response(uuid,uuid,jsonb) to anon;
commit;
