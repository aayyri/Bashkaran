# Befragung – noch nicht produktiv verbunden

Öffentliches Formular: /research/ · private Auswertung: /research/admin.html.
Keine Menü- oder Sitemap-Verlinkung, noindex. Der Link ist kein Zugriffsschutz:
Jede Person mit dem Link kann teilnehmen. Nur Antworten und Auswertung sind geschützt.

## Einrichtung vor Veröffentlichung
1. Supabase-Projekt erstellen, geeignete Datenregion wählen.
2. schema.sql, danach survey-schema.sql im SQL-Editor ausführen (einmalige Migrationen).
3. Eigenes Konto in Supabase Auth anlegen; öffentliche Registrierung deaktivieren.
4. Dessen UUID in research_members freigeben (SQL-Editor, nicht Browser).
5. Projekt-URL und öffentlichen **anon JWT key** in config.js eintragen. Niemals service_role/Secret!
   Der REST-Aufruf verwendet den anon JWT im Authorization-Header.
6. Datenschutzinformationen um Zweck, Anbieter, Datenregion und festgelegte Aufbewahrungsdauer
   für diese Befragung ergänzen und vor dem Versand prüfen. Keine absolute Anonymität versprechen:
   Hostinganbieter können technische Verbindungsdaten verarbeiten.
7. Vor Veröffentlichung Schutz vor automatisierten Einsendungen ergänzen (serverseitig geprüftes
   CAPTCHA oder begrenzte Einladungslinks). Der aktuelle anonyme Insert-Endpunkt hat noch keinen
   Spam-/Rate-Limit-Schutz. Nicht unkontrolliert öffentlich verbreiten.
8. Testen: anonym INSERT erlaubt, SELECT/UPDATE/DELETE verweigert;
   nicht freigegebenes Konto ohne Lesezugriff; freigegebenes Konto liest Antworten.
   Eine Testantwort auf Gerät A senden, auf Gerät B nach Anmeldung sehen.
9. Erst danach auf bestehendem Vercel-Projekt veröffentlichen. Kein Sites-Umzug.

Es werden keine Antworten lokal dauerhaft gespeichert. Ohne Konfiguration ist das Absenden
deaktiviert. Antworten werden erst nach erfolgreicher Serverbestätigung als gespeichert angezeigt.
Auswertung zählt je Frage, zeigt fehlende Antworten separat.
Die alte Interviewoberfläche wurde entfernt.
