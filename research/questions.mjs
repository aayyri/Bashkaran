const originalQuestions = [
 {id:'search',title:'Wo suchst du aktuell nach Wohnungen?',multi:true,options:['Immobilienportale','Websites von Verwaltungen / Maklern','Social Media','Freunde / Familie / Bekannte','Andere Wege','Ich suche aktuell nicht'],exclusive:'Ich suche aktuell nicht',free:'Andere Wege oder Ergänzungen'},
 {id:'platforms',title:'Auf wie vielen Plattformen suchst du gleichzeitig?',options:['Keine','1','2–3','4–5','Mehr als 5','Weiss ich nicht']},
 {id:'applications',title:'Wie viele Wohnungsbewerbungen hast du in den letzten drei Monaten verschickt?',options:['Keine','1–2','3–5','6–10','Mehr als 10','Weiss ich nicht']},
 {id:'difficulty',title:'Wie erlebst du die Wohnungssuche insgesamt?',options:['Sehr einfach','Eher einfach','Weder einfach noch schwierig','Eher schwierig','Sehr schwierig','Kann ich nicht beurteilen']},
 {id:'problems',title:'Was hat dir bei deiner bisherigen Suche Schwierigkeiten bereitet?',multi:true,options:['Passende Wohnungen finden','Unvollständige / unklare Inserate','Besichtigungstermine vereinbaren','Bewerbung ausfüllen','Angaben mehrfach eingeben','Unterlagen beschaffen / hochladen','Lange Wartezeiten','Fehlende Rückmeldungen','Unklarer Bewerbungsstatus','Bedienung auf dem Handy','Vertrauen in Inserate','Umgang mit persönlichen Daten','Etwas anderes','Nichts davon'],exclusive:'Nichts davon',free:'Was genau war schwierig? Ein konkretes Beispiel hilft uns.'},
 {id:'last',title:'Wie hast du deine letzte Wohnungsbewerbung eingereicht?',options:['Onlineformular / Bewerbungsportal','E-Mail','Papier / persönlich','Anderer Weg','Noch nie beworben','Weiss ich nicht mehr'],free:'Wenn du möchtest: Wie lief die letzte Bewerbung ab?'},
 {id:'repeat',title:'Welche Angaben oder Unterlagen musstest du bei verschiedenen Bewerbungen erneut einreichen?',multi:true,options:['Persönliche Angaben','Angaben zu Arbeit / Einkommen','Betreibungsregisterauszug','Lohnnachweise','Referenzen','Andere Angaben / Unterlagen','Keine','Bisher keine oder nur eine Bewerbung'],exclusive:['Keine','Bisher keine oder nur eine Bewerbung'],free:'Ergänzungen – bitte keine Dokumente oder persönlichen Daten einfügen.'},
 {id:'status',title:'Wusstest du nach dem Abschicken, wie der Stand deiner Bewerbung war?',options:['Immer','Meistens','Manchmal','Selten','Nie','Noch keine Bewerbung verschickt'],free:'Wie wurdest du informiert – oder welche Information fehlte?'},
 {id:'priority',title:'Wenn du nur eine Sache verbessern könntest: Welche wäre das?',options:['Passende Wohnungen finden','Bessere Informationen im Inserat','Einfachere Besichtigungstermine','Einfachere Bewerbung','Weniger wiederholte Eingaben / Unterlagen','Schnellere Rückmeldungen','Klarer Bewerbungsstatus','Bessere mobile Bedienung','Mehr Vertrauen / Datenschutz','Etwas anderes','Ich würde nichts ändern'],free:'Warum gerade diese Sache?'},
 {id:'anything',title:'Was möchtest du uns sonst noch mitgeben?',free:'Weitere Erfahrungen, Wünsche oder ein konkretes Erlebnis',onlyText:true}
];
// Keep previous questions available when reviewing existing responses.
export const questions = originalQuestions
 .filter(q=>!['platforms','difficulty'].includes(q.id))
 .map(q=>{const {free,...rest}=q;return {...rest,...(q.id==='problems'?{free:'Wenn du magst: Erzähle uns von einem konkreten Erlebnis.'}:q.id==='anything'?{free:'Weitere Erfahrungen oder Ergänzungen'}:{})};});
export const reviewQuestions = [...questions, ...originalQuestions.filter(q=>['platforms','difficulty'].includes(q.id))];
export function validate(p){
 if(!p || p.version!==2 || p.consent!==true || !p.answers || typeof p.answers!=='object')return false;
 for(const q of questions){const a=p.answers[q.id];if(!a||!Array.isArray(a.values)||typeof a.text!=='string'||a.text.length>3000||a.values.some(v=>!q.options?.includes(v))||new Set(a.values).size!==a.values.length||(!q.multi&&a.values.length>1))return false; const exclusive=[q.exclusive].flat();if(a.values.length>1&&a.values.some(v=>exclusive.includes(v)))return false;}
 return !('solution' in p);
}
export function counts(rows,q){return (q.options||[]).map(label=>[label,rows.filter(r=>r.payload.answers[q.id]?.values.includes(label)).length]);}
