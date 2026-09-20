export const questionnaire='rental-journey-v1';
const phases=['Wohnungssuche / Besichtigungen / Bewerbung','Mietvertrag / Einzug','Wohnen in einer Mietwohnung'];
const example='Wenn du magst: Was ist konkret passiert?';
const enExample='If you like, what happened?';
function problem(id,phase,title,options,enTitle,enOptions){return {id,phase,title,multi:true,options:[...options,'Etwas anderes','Keine Schwierigkeiten','Kann ich nicht beurteilen'],exclusive:['Keine Schwierigkeiten','Kann ich nicht beurteilen'],other:['Etwas anderes','Was war sonst schwierig?'],free:example,en:{title:enTitle,options:[...enOptions,'Something else','No difficulties','I cannot judge'],other:'What else was difficult?',free:enExample}};}
export const journeyQuestions=[
 {id:'journey_phases',title:'Welche Phasen hast du selbst schon erlebt?',multi:true,options:[...phases,'Noch keine dieser Phasen'],exclusive:'Noch keine dieser Phasen',en:{title:'Which stages have you personally experienced?',options:['Searching / viewings / applying','Rental agreement / moving in','Living in a rented home','None of these stages yet']}},
 problem('journey_search',phases[0],'Wenn du an deine letzte Suche denkst: Was war schwierig?',[
 'Passende Wohnungen finden','Informationen in Inseraten verstehen','Besichtigungstermine vereinbaren / wahrnehmen','Bewerbungen ausfüllen','Angaben / Dokumente mehrfach einreichen','Rückmeldungen oder Bewerbungsstatus erhalten','Vertrauen in Inserate / Umgang mit Daten'],
 'Thinking about your most recent search, what was difficult?',[
 'Finding suitable homes','Understanding information in listings','Arranging / attending viewings','Completing applications','Submitting the same information / documents repeatedly','Getting responses or application updates','Trusting listings / handling of personal data']),
 problem('journey_contract',phases[1],'Bei deinem letzten Mietvertrag und Einzug: Was war schwierig?',[
 'Vertrag / Bedingungen verstehen','Offene Fragen vor der Unterschrift klären','Vertrag erhalten / unterschreiben','Mietkaution organisieren','Einzug / Schlüsselübergabe abstimmen','Wohnungszustand / Mängel dokumentieren'],
 'During your most recent rental agreement and move-in, what was difficult?',[
 'Understanding the agreement / terms','Clarifying questions before signing','Receiving / signing the agreement','Arranging the rental deposit','Coordinating move-in / key handover','Recording the condition of the home / defects']),
 problem('journey_living',phases[2],'Beim Wohnen in deiner aktuellen oder letzten Mietwohnung: Was war schwierig?',[
 'Zuständige Ansprechperson erreichen','Mängel / Reparaturen melden','Rückmeldungen / Bearbeitungsstand erhalten','Auf Reparaturen warten','Nebenkostenabrechnung verstehen / klären','Mietzahlungen / Änderungen nachvollziehen','Dokumente / Absprachen wiederfinden'],
 'While living in your current or most recent rented home, what was difficult?',[
 'Reaching the right contact person','Reporting defects / requesting repairs','Getting responses / progress updates','Waiting for repairs','Understanding / clarifying utility and service charge statements','Keeping track of rent payments / changes','Finding documents / previous agreements']),
];
export function visibleQuestions(answers){const selected=answers.journey_phases?.values||[];return journeyQuestions.filter(q=>!q.phase||selected.includes(q.phase));}
export function journeySteps(answers){const selected=answers.journey_phases?.values||[];return [
 {title:'Deine Erfahrungen',ids:['journey_phases']},
 ...phases.filter(p=>selected.includes(p)).map((p,i)=>({title:p,ids:journeyQuestions.filter(q=>q.phase===p).map(q=>q.id)})),
 {title:'Absenden',ids:[],final:true}
 ];}
export function submissionPayload(payload){const ids=new Set(visibleQuestions(payload.answers).map(q=>q.id));return {...payload,answers:Object.fromEntries(Object.entries(payload.answers).filter(([id])=>ids.has(id)))};}
export function validateJourney(p){
 if(p.version!==2||p.questionnaire!==questionnaire||p.consent!==true||!p.answers||typeof p.answers!=='object'||Array.isArray(p.answers)||'solution'in p)return false;
 if(p.source!==undefined&&!['website','invitation','unknown'].includes(p.source))return false;
 if(p.language!==undefined&&!['de','en'].includes(p.language))return false;
 const list=visibleQuestions(p.answers);
 if(Object.keys(p.answers).some(id=>!list.some(q=>q.id===id)))return false;
 return list.every(q=>{const a=p.answers[q.id];if(!a||!Array.isArray(a.values)||typeof a.text!=='string'||a.text.length>3000||a.values.some(v=>!q.options?.includes(v))||new Set(a.values).size!==a.values.length||(!q.multi&&a.values.length>1))return false;
 if(a.values.length>1&&a.values.some(v=>[q.exclusive].flat().includes(v)))return false;
 return a.otherText===undefined||(typeof a.otherText==='string'&&a.otherText.length<=1000&&(!a.otherText||(q.other&&a.values.includes(q.other[0]))));});
}
