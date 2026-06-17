# QA-4 · Anonyme Sichtbarkeit fremder Buchungen

**Qualitätsmerkmal:** Sicherheit / Datenschutz
**Priorität:** 4 von 5

**Szenario (Prosa):**
> Im Normalbetrieb öffnet ein eingeloggter INNOQ-Mitarbeiter die Buchungsübersicht
> bzw. Tagesbelegung eines Konferenzraums, der von einer anderen Person gebucht
> wurde. Das System zeigt **fremde Zeitfenster ausschließlich anonym als „belegt“;
> Meetingtitel, Notiz und Name sind nur bei eigenen Buchungen sichtbar – in 100 % der
> Zugriffe werden zu fremden Buchungen keine personenbezogenen Daten ausgeliefert.**

| Baustein | Ausprägung |
|----------|------------|
| **Environment** | Normalbetrieb, eingeloggter Mitarbeiter betrachtet eine fremde Belegung |
| **Source** | INNOQ-Mitarbeiter (nicht der Buchende) |
| **Event** | Öffnet die Buchungsübersicht / Tagesbelegung eines Raums an einem Standort |
| **Artifact** | Calvin Web-App + Booking Service (Autorisierung der ausgelieferten Felder) |
| **Response** | Fremde Slots erscheinen nur als „belegt“ (ohne Titel/Notiz/Person); vollständige Details nur bei eigenen Buchungen |
| **Measure** | In 100 % der Zugriffe keine personenbezogenen Daten (Name, Meetingtitel, Notiz) zu fremden Buchungen; abgesichert durch automatisierte Tests und Reviews |

**Motivation:** Transparenz über Verfügbarkeit darf nicht zu Lasten des
Persönlichkeitsschutzes gehen. Mitarbeiter sehen, *dass* belegt ist, aber nicht
*wer was* macht – das wahrt Vertrauen und Datensparsamkeit.

---

[← Übersicht Qualitätsanforderungen](./README.md)
