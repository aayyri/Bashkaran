import {reasonOptions} from './reason-options.mjs';
import {followupPrompt} from './followups.mjs';
import {translate,translatePage} from './locale.mjs';
import {questionnaire,journeySteps,submissionPayload} from './journey.mjs';
import {sourceFromSearch} from './source.mjs';
import {questions,validate} from './questions.mjs';
import {escape as e} from './core.mjs';
const app=document.querySelector('#app'),notice=document.querySelector('#notice'),cfg=window.RESEARCH_CONFIG||{};
const ready=/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(cfg.url||'')&&!!cfg.publishableKey&&cfg.submissionsEnabled===true;
const payload={version:2,questionnaire,language:'de',source:sourceFromSearch(location.search),consent:false,answers:Object.fromEntries(questions.map(q=>[q.id,{values:[],text:''}]))};
const pathLanguage=location.pathname.match(/^\/research\/(de|en)\/?$/)?.[1];
let language=pathLanguage||(new URLSearchParams(location.search).get('lang')==='en'?'en':'de');
const languageControl=document.querySelector('#language'),footer=document.querySelector('footer'),footerGerman=footer.innerHTML;
const t=text=>translate(text,language);
let welcome=true;
let step=0,sending=false,changed=false,completed=false;const submissionId=crypto.randomUUID();
if(!ready)notice.textContent=t("Vorschau: Die Speicherung wird noch eingerichtet. Absenden ist noch nicht freigegeben.");
window.addEventListener('beforeunload',ev=>{if(changed){ev.preventDefault();ev.returnValue='';}});
function question(q){const a=payload.answers[q.id];return `<fieldset class="card"><legend>${e(q.title)}</legend><p class="muted">${q.multi?'Mehrfachauswahl möglich':'Eine Antwort möglich'}</p><div class="choices">${q.options.map(o=>`<label class="choice"><input type="${q.multi?'checkbox':'radio'}" name="${q.id}" value="${e(o)}" ${a.values.includes(o)?'checked':''}>${e(o)}</label>`).join('')}</div></fieldset>`;}
function reasonFields(q){const a=payload.answers[q.id];return `<section class="card reason-card">${q.options.map((o,i)=>{if(!a.values.includes(o)||!q.followups?.includes(o))return '';const saved=a.reasons?.[o];const v=typeof saved==='string'?{values:saved?['Andere']:[],text:saved}:saved||{values:[],text:''};const key=q.id+'-reason-'+i;return `<fieldset class="reason-group"><legend>${e(followupPrompt(q.id,i,language))}</legend><p class="muted">Mehrfachauswahl möglich</p>${reasonOptions(q.id,i).map(([de,en])=>`<label class="choice"><input type="checkbox" name="${key}" value="${e(de)}" ${v.values.includes(de)?'checked':''} ${de==='Andere'?`data-other-target="${key}-other-wrap"`:''}>${e(language==='en'?en:de)}</label>`).join('')}<div id="${key}-other-wrap" ${v.values.includes('Andere')?'':'hidden'}><label for="${key}-other">${language==='en'?'What other reason was there?':'Welchen anderen Grund gab es?'}</label><textarea class="notes" id="${key}-other" maxlength="1000">${e(v.text||'')}</textarea></div></fieldset>`;}).join('')}${q.other&&a.values.includes(q.other[0])?`<label class="reason-other-title" for="${q.id}-other">${e(q.other[1])}</label><textarea class="notes" id="${q.id}-other" maxlength="1000">${e(a.otherText||'')}</textarea>`:''}</section>`;}
function render(){
 document.documentElement.lang=language==='en'?'en':'de-CH';document.title=language==='en'?'Survey | Bashkaran Real Estate':'Umfrage | Bashkaran Real Estate';languageControl.value=language;footer.innerHTML=footerGerman;translatePage(footer,language);payload.language=language;
 document.body.classList.toggle('survey-welcome',welcome&&!completed);
 if(completed){app.innerHTML=successMarkup;translatePage(app,language);return;}
 if(welcome){app.innerHTML='<div class="narrow"><section class="card survey-intro" aria-labelledby="survey-title"><h1 id="survey-title">Deine Erfahrung zählt.</h1><p>Mit dieser Umfrage möchten wir verstehen, was bei Wohnungssuche, Bewerbung, Mietvertrag und im Mietalltag schwierig ist. Teile deine Erfahrungen mit uns.</p><div class="actions"><button class="primary" id="start-survey" type="button">Zur Umfrage</button></div><p class="muted welcome-note">Deine Teilnahme hat keinen Einfluss auf eine Wohnungsbewerbung. Wir fragen weder Namen noch E-Mail-Adressen ab.</p></section></div>';translatePage(app,language);document.querySelector('#start-survey').onclick=()=>{welcome=false;render();window.scrollTo(0,0);};return;}
 const steps=journeySteps(payload.answers),current=steps[step];const isFinal=!!current.final;const group=questions.filter(q=>current.ids.includes(q.id));
 app.innerHTML=`<div class="narrow"><p class="eyebrow">${step+1} · ${e(t(current.title))}</p><form id="survey">${group.map(current.reasons?reasonFields:question).join('')}${isFinal?`<section class="card"><h2>Antworten absenden</h2><p>Vielen Dank für deine Erfahrungen. Über „Zurück“ kannst du deine Antworten nochmals prüfen.</p></section><label class="check"><input type="checkbox" id="consent" ${payload.consent?'checked':''}>Ich stimme zu, dass Bashkaran Real Estate meine Antworten für die interne Auswertung dieser Befragung speichert. Hinweise zum Umgang mit Daten stehen in der <a href="/datenschutz" target="_blank" rel="noopener">Datenschutzerklärung</a>.</label>`:''}<div class="actions"><button type="button" id="previous">Zurück</button><button class="primary" ${isFinal?'type="submit"':''} ${isFinal&&!ready?'disabled':''}>${isFinal?'Antworten senden':'Weiter'}</button></div>${isFinal?'<p class="muted">Es wird erst beim Absenden gespeichert. </p>':''}</form></div>`;
 translatePage(app,language);
 document.querySelector('#previous')?.addEventListener('click',()=>{capture();if(step===0)welcome=true;else step--;render();window.scrollTo(0,0);});
 document.querySelector('#survey').addEventListener('input',ev=>{changed=true;if(ev.target.dataset.otherTarget)document.getElementById(ev.target.dataset.otherTarget).hidden=!ev.target.checked;const q=questions.find(q=>q.id===ev.target.name);if(q?.multi&&ev.target.checked){const ex=[q.exclusive].flat();document.querySelectorAll(`input[name="${q.id}"]`).forEach(el=>{if(el!==ev.target&&(ex.includes(ev.target.value)||ex.includes(el.value)))el.checked=false;});}});
 document.querySelector('#survey').addEventListener('submit',async ev=>{ev.preventDefault();if(sending)return;capture();if(!isFinal){step++;render();window.scrollTo(0,0);return;}if(!payload.consent){notice.textContent=t("Bitte bestätige die Zustimmung vor dem Absenden.");notice.scrollIntoView();return;}if(!validate(submissionPayload(payload))){notice.textContent=t("Bitte prüfe deine Eingaben.");return;}if(!ready)return;sending=true;const btn=ev.submitter;btn.disabled=true;languageControl.disabled=true;btn.textContent=t("Wird gesendet …");try{const res=await fetch('/api/research-submit',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({submission:submissionId,answer:submissionPayload(payload)})});if(!res.ok)throw Error();const receipt=await res.json();if(receipt!==submissionId)throw Error();changed=false;completed=true;notice.textContent='';render();}catch{notice.textContent=t("Die Antworten konnten nicht gesendet werden. Deine Eingaben bleiben in diesem geöffneten Fenster erhalten. Bitte versuche es erneut.");btn.disabled=false;btn.textContent=t("Erneut senden");}finally{sending=false;languageControl.disabled=false;}});
}
function capture(){
 if(welcome)return;
 const current=journeySteps(payload.answers)[step];
 if(current.final)payload.consent=document.querySelector('#consent').checked;
 for(const q of questions.filter(q=>current.ids.includes(q.id))){
  const a=payload.answers[q.id];
  if(current.reasons){
   a.reasons=Object.fromEntries((q.followups||[]).filter(o=>a.values.includes(o)).map(o=>{const key=q.id+'-reason-'+q.options.indexOf(o);const values=[...document.querySelectorAll(`input[name="${key}"]:checked`)].map(el=>el.value);return [o,{values,text:values.includes('Andere')?document.getElementById(key+'-other').value:''}];}));
   a.otherText=document.querySelector(`#${q.id}-other`)?.value||'';
  }else{
   a.values=[...document.querySelectorAll(`input[name="${q.id}"]:checked`)].map(el=>el.value);
   a.reasons=Object.fromEntries(Object.entries(a.reasons||{}).filter(([o])=>a.values.includes(o)));
   if(!q.other||!a.values.includes(q.other[0]))a.otherText='';
  }
 }
}
const successMarkup='<div class="narrow card"><p class="eyebrow">Befragung abgeschlossen</p><h1>Vielen Dank!</h1><p>Deine Antworten wurden gespeichert. Du kannst dieses Fenster jetzt schliessen.</p></div>';
languageControl.addEventListener('change',()=>{if(sending)return;if(!completed)capture();language=languageControl.value;notice.textContent='';const url=new URL(location.href);url.pathname='/research/'+language;url.searchParams.delete('lang');history.replaceState(null,'',url);render();});
render();
