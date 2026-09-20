// Store session tokens only, never the password or survey responses.
export function createSession(cfg,onExpired=()=>{}){
 const key='bashkaran-research-session-v1';
 let session=null,persistent=false,pending=null,timer=null,generation=0;
 const read=store=>{try{return JSON.parse(store.getItem(key)||'null');}catch{return null;}};
 window.addEventListener('storage',event=>{if(persistent&&event.key===key&&!event.newValue){clear();onExpired('Du wurdest abgemeldet.');}});
 function clear(){generation++;clearTimeout(timer);session=null;for(const store of [localStorage,sessionStorage]){try{store.removeItem(key);}catch{}}}
 function save(data){
  if(!data.access_token||!data.refresh_token)throw Error('Ungültige Sitzung.');
  session={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:data.expires_at||Math.floor(Date.now()/1000)+(data.expires_in||3600)};
  const store=persistent?localStorage:sessionStorage;
  try{store.setItem(key,JSON.stringify(session));}catch{throw Error('Der Browser blockiert die Sitzungsspeicherung. Bitte erlaube Website-Daten.');}
  clearTimeout(timer);timer=setTimeout(()=>access().catch(()=>{}),Math.max(1000,(session.expires_at*1000-Date.now()-60000)));
 }
 async function exchange(grant,body){
  const res=await fetch(cfg.url+'/auth/v1/token?grant_type='+grant,{method:'POST',headers:{apikey:cfg.publishableKey,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
  if(!res.ok){const err=Error(res.status===400||res.status===401?'Sitzung abgelaufen oder Zugangsdaten ungültig. Bitte erneut anmelden.':'Anmeldung momentan nicht erreichbar. Bitte erneut versuchen.');err.invalid=res.status===400||res.status===401;throw err;}
  return res.json();
 }
 async function refresh(){
  const run=async()=>{
   const saved=read(persistent?localStorage:sessionStorage);
   if(saved?.refresh_token)session=saved;
   if(!session)throw Error('Bitte anmelden.');
   if(session.expires_at*1000>Date.now()+60000){save(session);return session.access_token;}
   const current=generation;
   try{const data=await exchange('refresh_token',{refresh_token:session.refresh_token});if(current!==generation)throw Error('Sitzung beendet.');save(data);return session.access_token;}
   catch(err){if(err.invalid){clear();onExpired(err.message);}else if(session){clearTimeout(timer);timer=setTimeout(()=>access().catch(()=>{}),30000);}throw err;}
  };
  return navigator.locks?navigator.locks.request(key,run):run();
 }
 async function access(){if(!session)throw Error('Bitte anmelden.');if(session.expires_at*1000>Date.now()+60000)return session.access_token;if(!pending)pending=refresh().finally(()=>{pending=null;});return pending;}
 return {
  async signIn(email,password,remember){clear();persistent=remember;const data=await exchange('password',{email,password});save(data);return access();},
  async restore(){const saved=read(localStorage);persistent=!!saved;session=saved||read(sessionStorage);if(!session?.refresh_token||!session?.access_token){clear();return false;}await access();save(session);return true;},
  access,
  async signOut(){const token=session?.access_token;clear();if(token){const r=await fetch(cfg.url+'/auth/v1/logout?scope=local',{method:'POST',headers:{apikey:cfg.publishableKey,Authorization:'Bearer '+token},signal:AbortSignal.timeout(10000)});if(!r.ok&&r.status!==401)throw Error('Lokal abgemeldet. Die serverseitige Abmeldung konnte nicht bestätigt werden.');}},
  clear
 };
}
