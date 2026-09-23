const prompts = {
 journey_search: [
  ['Warum war es schwierig, passende Wohnungen zu finden?', 'Why was it difficult to find suitable homes?'],
  ['Warum waren die Informationen in den Inseraten schwer verständlich?', 'Why was the information in the listings hard to understand?'],
  ['Warum war es schwierig, Besichtigungstermine zu vereinbaren oder wahrzunehmen?', 'Why was it difficult to arrange or attend viewings?'],
  ['Warum war es schwierig, die Bewerbungen auszufüllen?', 'Why was it difficult to complete the applications?'],
  ['Warum war das mehrfache Einreichen deiner Angaben oder Dokumente mühsam?', 'Why was submitting your information or documents repeatedly frustrating?'],
  ['Warum war es schwierig, Rückmeldungen oder Informationen zum Bewerbungsstatus zu erhalten?', 'Why was it difficult to get responses or updates on your application?'],
  ['Warum hattest du Bedenken bei den Inseraten oder beim Umgang mit deinen Daten?', 'Why did you have concerns about the listings or how your data was handled?']
 ],
 journey_contract: [
  ['Warum war es schwierig, den Mietvertrag oder seine Bedingungen zu verstehen?', 'Why was it difficult to understand the rental agreement or its terms?'],
  ['Warum war es schwierig, offene Fragen vor der Unterschrift zu klären?', 'Why was it difficult to clarify your questions before signing?'],
  ['Warum war es schwierig, den Mietvertrag zu erhalten oder zu unterschreiben?', 'Why was it difficult to receive or sign the rental agreement?'],
  ['Warum war es schwierig, die Mietkaution zu organisieren?', 'Why was it difficult to arrange the rental deposit?'],
  ['Warum war es schwierig, den Einzug oder die Schlüsselübergabe abzustimmen?', 'Why was it difficult to coordinate moving in or collecting the keys?'],
  ['Warum war es schwierig, den Wohnungszustand oder vorhandene Mängel zu dokumentieren?', 'Why was it difficult to document the condition of the home or existing defects?']
 ],
 journey_living: [
  ['Warum war es schwierig, die zuständige Ansprechperson zu erreichen?', 'Why was it difficult to reach the right contact person?'],
  ['Warum war es schwierig, Mängel zu melden oder Reparaturen anzufordern?', 'Why was it difficult to report defects or request repairs?'],
  ['Warum war es schwierig, Rückmeldungen zum Stand deines Anliegens zu erhalten?', 'Why was it difficult to get updates on your request?'],
  ['Warum war das Warten auf Reparaturen für dich problematisch?', 'Why was waiting for repairs a problem for you?'],
  ['Warum war es schwierig, die Nebenkostenabrechnung zu verstehen oder Fragen dazu zu klären?', 'Why was it difficult to understand the utility and service charge statement or clarify questions about it?'],
  ['Warum war es schwierig, Mietzahlungen oder Änderungen nachzuvollziehen?', 'Why was it difficult to keep track of rent payments or changes?'],
  ['Warum war es schwierig, Dokumente oder frühere Absprachen wiederzufinden?', 'Why was it difficult to find documents or previous agreements?']
 ]
};
export function followupPrompt(id,index,language){return prompts[id]?.[index]?.[language==='en'?1:0]||'';}
