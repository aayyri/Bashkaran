const data={
 journey_search:[
  [['Mieten zu hoch','Rents too high'],['Zu wenige passende Angebote','Too few suitable listings'],['Angebote schnell vergeben','Homes taken quickly']],
  [['Wichtige Angaben fehlten','Important details missing'],['Kosten waren unklar','Costs unclear'],['Fotos oder Grundriss fehlten','Photos or floor plan missing']],
  [['Termine passten zeitlich nicht','Times did not suit me'],['Keine Antwort auf Terminanfrage','No response to viewing request'],['Zu kurzfristig angekündigt','Too little notice']],
  [['Zu viele Angaben verlangt','Too much information requested'],['Fragen waren unklar','Questions unclear'],['Technische Probleme','Technical problems']],
  [['Gleiche Daten immer neu eingeben','Entering the same data repeatedly'],['Dokumente erneut hochladen','Uploading documents again'],['Unterschiedliche Anforderungen','Different requirements']],
  [['Keine Rückmeldung','No response'],['Unklare Wartezeit','Unclear waiting time'],['Kein einsehbarer Status','No visible status']],
  [['Inserat wirkte unseriös','Listing seemed suspicious'],['Zu früh sensible Daten verlangt','Sensitive data requested too early'],['Unklar, wer Daten erhält','Unclear who receives my data']]
 ],
 journey_contract:[
  [['Fachbegriffe unverständlich','Unclear terminology'],['Kosten oder Pflichten unklar','Costs or obligations unclear'],['Zu wenig Zeit zum Prüfen','Too little time to review']],
  [['Ansprechperson nicht erreichbar','Contact person unavailable'],['Antworten unvollständig','Incomplete answers'],['Zeitdruck vor Unterschrift','Pressure to sign quickly']],
  [['Vertrag kam spät','Agreement arrived late'],['Unklarer Ablauf','Unclear process'],['Ausdrucken oder Postversand nötig','Printing or postal delivery required']],
  [['Betrag war zu hoch','Amount too high'],['Ablauf war unklar','Process unclear'],['Abwicklung war umständlich','Administration cumbersome'],['Zu wenig Zeit bis zum Einzug','Too little time before moving in']],
  [['Termin passte nicht','Timing did not suit me'],['Zuständigkeiten unklar','Responsibilities unclear'],['Kurzfristige Änderungen','Last-minute changes']],
  [['Kein klares Übergabeprotokoll','No clear handover report'],['Mängel erst später entdeckt','Defects discovered later'],['Uneinigkeit über den Zustand','Disagreement about condition']]
 ],
 journey_living:[
  [['Kontaktangaben fehlten','Contact details missing'],['Keine Antwort auf Anfragen','No response to requests'],['Zwischen Stellen weiterverwiesen','Passed between contacts']],
  [['Meldeweg unklar','Reporting process unclear'],['Problem schwer zu beschreiben','Problem hard to describe'],['Meldung mehrfach nötig','Had to report repeatedly']],
  [['Keine Eingangsbestätigung','No acknowledgement'],['Kein Status oder Termin','No status or date'],['Musste selbst nachfragen','Had to chase updates']],
  [['Lange Wartezeit','Long wait'],['Termine wurden verschoben','Appointments postponed'],['Wohnung nur eingeschränkt nutzbar','Use of home restricted']],
  [['Kosten nicht nachvollziehbar','Costs hard to follow'],['Belege fehlten','Supporting documents missing'],['Fragen blieben offen','Questions unanswered']],
  [['Änderungen nicht erklärt','Changes not explained'],['Zahlungsangaben unklar','Payment details unclear'],['Unstimmigkeiten bei Beträgen','Discrepancies in amounts']],
  [['Auf verschiedene Kanäle verteilt','Scattered across channels'],['Kein zentraler Ablageort','No central storage'],['Absprachen nur mündlich','Only verbal agreements']]
 ]
};
export function reasonOptions(id,index){return [...(data[id]?.[index]||[]),['Andere','Other']];}
export function validReason(value,id,index){
 if(typeof value==='string')return value.length<=1000;
 if(!value||typeof value!=='object'||!Array.isArray(value.values)||typeof value.text!=='string'||value.text.length>1000)return false;
 const allowed=reasonOptions(id,index).map(x=>x[0]);
 return new Set(value.values).size===value.values.length&&value.values.every(x=>allowed.includes(x))&&(!value.text||value.values.includes('Andere'));
}
export function reasonText(value){return typeof value==='string'?value:[...(value?.values||[]),value?.text].filter(Boolean).join('; ');}
