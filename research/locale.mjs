import {questions} from './questions.mjs';
const english = {
 search:{title:'Where do you currently look for a home?',options:['Property portals','Property management / estate agent websites','Social media','Friends / family / acquaintances','Other ways','I am not currently looking'],other:'What other ways do you use?'},
 applications:{title:'How many rental applications have you submitted in the last three months?',options:['None','1–2','3–5','6–10','More than 10','I don’t know']},
 problems:{title:'What has been difficult during your search so far?',options:['Finding suitable homes','Incomplete / unclear listings','Arranging viewings','Completing applications','Entering the same information repeatedly','Obtaining / uploading documents','Long waiting times','Lack of responses','Unclear application status','Using websites on a phone','Trusting listings','Handling of personal data','Something else','None of these'],other:'What else has been difficult?',free:'If you like, tell us about a specific experience.'},
 last:{title:'How did you submit your most recent rental application?',options:['Online form / application portal','Email','On paper / in person','Another way','I have never applied','I don’t remember'],other:'How did you apply?'},
 repeat:{title:'Which information or documents did you have to submit again for different applications?',options:['Personal details','Employment / income information','Debt enforcement register extract','Payslips','References','Other information / documents','None','No applications or only one so far'],other:'What other information or documents?'},
 status:{title:'After submitting your application, did you know its status?',options:['Always','Usually','Sometimes','Rarely','Never','I have not applied yet']},
 priority:{title:'If you could improve just one thing, what would it be?',options:['Finding suitable homes','Better information in listings','Easier viewing arrangements','Simpler applications','Less repeated information / paperwork','Faster responses','Clear application status','Better mobile usability','More trust / privacy','Something else','I would not change anything'],other:'What would you improve?'},
 anything:{title:'Is there anything else you would like to tell us?',free:'Other experiences or comments'}
};
const translations = new Map(Object.entries({
 'Deine Erfahrungen':'Your experiences',
 'Wohnungssuche / Besichtigungen / Bewerbung':'Searching / viewings / applying',
 'Mietvertrag / Einzug':'Rental agreement / moving in',
 'Wohnen in einer Mietwohnung':'Living in a rented home',
 'Absenden':'Submit',
 'Deine Gründe':'Your reasons',
 'Mit dieser Umfrage möchten wir verstehen, was bei Wohnungssuche, Bewerbung, Mietvertrag und im Mietalltag schwierig ist. Teile deine Erfahrungen mit uns. Deine Teilnahme hat keinen Einfluss auf eine Wohnungsbewerbung. Wir fragen weder Namen noch E-Mail-Adressen ab.':'This survey helps us understand difficulties with finding a home, applying, signing a rental agreement and everyday renting. Share your experiences with us. Taking part will not affect any rental application. We do not ask for your name or email address.',
 'Deine Erfahrung zählt.':'Your experience matters.',
 'Was läuft bei der Wohnungssuche gut – und was ist mühsam? Mit deinen Antworten hilfst du uns, den Mietprozess besser zu verstehen.':'What works well when looking for a home, and what is frustrating? Your answers help us understand the rental process better.',
 'Deine Teilnahme hat keinen Einfluss auf eine Wohnungsbewerbung. Wir fragen weder Namen noch E-Mail-Adressen ab.':'Taking part will not affect any rental application. We do not ask for your name or email address.',
 'Mehrfachauswahl möglich':'You can select more than one answer',
 'Eine Antwort möglich':'Select one answer',
 '1 / 3 · Wohnungssuche':'1 / 3 · Finding a home',
 '2 / 3 · Bewerbung & Erfahrungen':'2 / 3 · Applications & experiences',
 '3 / 3 · Absenden':'3 / 3 · Submit',
 'Antworten absenden':'Submit your answers',
 'Vielen Dank für deine Erfahrungen. Über „Zurück“ kannst du deine Antworten nochmals prüfen.':'Thank you for sharing your experiences. You can review your answers by selecting “Back”.',
 'Ich stimme zu, dass Bashkaran Real Estate meine Antworten für die interne Auswertung dieser Befragung speichert. Hinweise zum Umgang mit Daten stehen in der':'I agree to Bashkaran Real Estate storing my answers for the internal analysis of this survey. Information about how data is handled is available in the',
 'Datenschutzerklärung':'Privacy policy (German)',
 'Zurück':'Back','Weiter':'Next','Antworten senden':'Submit answers','Zur Umfrage':'Start survey',
 'Mit dieser Umfrage möchten wir verstehen, was bei Wohnungssuche, Bewerbung, Mietvertrag und im Mietalltag schwierig ist. Teile deine Erfahrungen mit uns.':'This survey helps us understand difficulties with finding a home, applying, signing a rental agreement and everyday renting. Share your experiences with us.',
 'Es wird erst beim Absenden gespeichert.':'Your answers are only saved when you submit them.',
 'Bitte bestätige die Zustimmung vor dem Absenden.':'Please give your consent before submitting.',
 'Bitte prüfe deine Eingaben.':'Please check your answers.',
 'Wird gesendet …':'Sending …','Erneut senden':'Try again',
 'Befragung abgeschlossen':'Survey completed','Vielen Dank!':'Thank you!',
 'Deine Antworten wurden gespeichert. Du kannst dieses Fenster jetzt schliessen.':'Your answers have been saved. You can now close this window.',
 'Die Antworten konnten nicht gesendet werden. Deine Eingaben bleiben in diesem geöffneten Fenster erhalten. Bitte versuche es erneut.':'Your answers could not be submitted. They remain in this open window. Please try again.',
 'Vorschau: Die Speicherung wird noch eingerichtet. Absenden ist noch nicht freigegeben.':'Preview: Saving is still being set up. Submissions are not enabled yet.',
 'Rufen Sie uns an':'Call us','Schreiben Sie uns':'Email us'
}));
for(const q of questions){const en=q.en||english[q.id];translations.set(q.title,en.title);q.options?.forEach((o,i)=>translations.set(o,en.options[i]));if(q.free)translations.set(q.free,en.free);if(q.other)translations.set(q.other[1],en.other);}
export function translate(text,lang){return lang==='en'?(translations.get(text)||text):text;}
export function translatePage(root,lang){
 if(lang!=='en')return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode())){if(node.parentElement.closest('textarea,script,style,select'))continue;const key=node.textContent.trim();if(translations.has(key))node.textContent=node.textContent.replace(key,translations.get(key));}
}
