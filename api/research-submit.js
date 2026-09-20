module.exports = async function handler(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).end();}
 const {SUPABASE_URL:url,SUPABASE_SECRET_KEY:key,RESEARCH_ENABLED:enabled}=process.env;
 if(enabled!=='true'||!url||!key)return res.status(503).json({error:'Unavailable'});
 if(!['https://www.bashkaran.ch','https://bashkaran.ch'].includes(req.headers.origin))return res.status(403).end();
 try {
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(!body||JSON.stringify(body).length>50000)return res.status(400).end();
  const {submission,answer}=body;
  const {validate}=await import('../research/questions.mjs');
  if(typeof submission!=='string'||!/^[0-9a-f-]{36}$/i.test(submission)||!validate(answer))return res.status(400).end();
  const saved=await fetch(url+'/rest/v1/research_responses?on_conflict=id',{method:'POST',headers:{apikey:key,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({id:submission,payload:answer}),signal:AbortSignal.timeout(10000)});
  if(!saved.ok)return res.status(502).json({error:'Storage unavailable'});
  return res.status(200).json(submission);
 } catch {return res.status(503).json({error:'Please retry'});}
};
