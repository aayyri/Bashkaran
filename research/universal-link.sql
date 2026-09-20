-- Alten Einladungsweg schliessen. Daten und Einladungen bleiben erhalten.
revoke execute on function public.submit_research_response(uuid,uuid,jsonb) from public,anon,authenticated;
revoke execute on function public.create_research_invite() from public,anon,authenticated;
revoke insert on public.research_responses from anon,authenticated;
revoke insert(id,payload) on public.research_responses from anon,authenticated;
