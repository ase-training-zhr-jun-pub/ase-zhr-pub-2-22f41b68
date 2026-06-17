/**
 * Mock-Daten für den Calvin-Prototyp.
 *
 * Es gibt (noch) kein Backend – sämtliche Daten zu allen im Glossar
 * definierten Entitäten werden hier statisch bereitgestellt.
 */
import { Ausstattung, Konferenzraum, Mitarbeiter, Raumbuchung, Standort } from './models';

/** Die acht INNOQ-Standorte (Glossar: „Multi-Standort“). */
export const STANDORTE: Standort[] = [
  { id: 'mh', name: 'Monheim', stadt: 'Monheim am Rhein', land: 'Deutschland', kuerzel: 'MH', adresse: 'Krischerstraße 100, 40789 Monheim am Rhein', hauptsitz: true },
  { id: 'be', name: 'Berlin', stadt: 'Berlin', land: 'Deutschland', kuerzel: 'BE', adresse: 'Ohlauer Straße 43, 10999 Berlin' },
  { id: 'hh', name: 'Hamburg', stadt: 'Hamburg', land: 'Deutschland', kuerzel: 'HH', adresse: 'Ludwig-Erhard-Straße 18, 20459 Hamburg' },
  { id: 'k', name: 'Köln', stadt: 'Köln', land: 'Deutschland', kuerzel: 'K', adresse: 'Im Mediapark 5, 50670 Köln' },
  { id: 'm', name: 'München', stadt: 'München', land: 'Deutschland', kuerzel: 'M', adresse: 'Sonnenstraße 19, 80331 München' },
  { id: 'zh', name: 'Zürich', stadt: 'Zürich', land: 'Schweiz', kuerzel: 'ZH', adresse: 'Förrlibuckstrasse 110, 8005 Zürich' },
  { id: 'baar', name: 'Baar', stadt: 'Baar', land: 'Schweiz', kuerzel: 'BA', adresse: 'Lindenstrasse 16, 6340 Baar' },
  { id: 'of', name: 'Offenbach', stadt: 'Offenbach am Main', land: 'Deutschland', kuerzel: 'OF', adresse: 'Kaiserstraße 39, 63065 Offenbach am Main' },
];

/** Bekannte Ausstattungsmerkmale (Glossar: „Ausstattung“). */
export const AUSSTATTUNGEN: Ausstattung[] = [
  { id: 'bildschirm', name: 'Bildschirm', icon: '🖥️' },
  { id: 'beamer', name: 'Beamer', icon: '📽️' },
  { id: 'whiteboard', name: 'Whiteboard', icon: '🧑‍🏫' },
  { id: 'flipchart', name: 'Flipchart', icon: '📋' },
  { id: 'videokonferenz', name: 'Videokonferenz', icon: '📹' },
  { id: 'telefonkonferenz', name: 'Telefonkonferenz', icon: '☎️' },
  { id: 'klimaanlage', name: 'Klimaanlage', icon: '❄️' },
  { id: 'hdmi', name: 'HDMI-Anschluss', icon: '🔌' },
  { id: 'barrierefrei', name: 'Barrierefrei', icon: '♿' },
  { id: 'kaffee', name: 'Kaffeemaschine', icon: '☕' },
];

/** Akzentfarben aus der INNOQ-Palette für die Raum-Kacheln. */
const RAUM_FARBEN = ['#004153', '#ff9c66', '#009999', '#ff4d67', '#fff019', '#005268', '#68ddc3', '#d01040'];

/**
 * Raumnamen je Standort – Pioniere der Informatik, passend zur
 * Software-Beratung INNOQ.
 */
const RAUM_THEMEN: Record<string, string[]> = {
  mh: ['Turing', 'Lovelace', 'Hopper', 'Knuth', 'Dijkstra'],
  be: ['Neumann', 'Kay', 'Ritchie', 'Liskov'],
  hh: ['Torvalds', 'Wirth', 'Backus'],
  k: ['Hamilton', 'Engelbart', 'Cerf', 'Berners-Lee'],
  m: ['Shannon', 'Hoare', 'Allen'],
  zh: ['Wirth', 'Nygaard', 'Iverson'],
  baar: ['Floyd', 'Milner'],
  of: ['Goldberg', 'Sutherland', 'Codd'],
};

/**
 * Generiert deterministische, aber abwechslungsreiche Konferenzräume
 * für alle Standorte.
 */
function baueRaeume(): Konferenzraum[] {
  const kapazitaeten = [4, 6, 8, 10, 12, 16, 20];
  const ausstattungsPool = AUSSTATTUNGEN.map((a) => a.id);
  const raeume: Konferenzraum[] = [];
  let lfd = 0;

  for (const standort of STANDORTE) {
    const namen = RAUM_THEMEN[standort.id] ?? ['Alpha', 'Beta'];
    namen.forEach((name, i) => {
      const kapazitaet = kapazitaeten[(lfd + i) % kapazitaeten.length];
      // Deterministische, gut verteilte Ausstattung pro Raum.
      const anzahlMerkmale = 3 + ((lfd + i) % 5);
      const ausstattungIds: string[] = [];
      for (let m = 0; m < anzahlMerkmale; m++) {
        const id = ausstattungsPool[(lfd * 3 + i * 2 + m * 5) % ausstattungsPool.length];
        if (!ausstattungIds.includes(id)) ausstattungIds.push(id);
      }
      const etage = (i % 4) + 1;
      raeume.push({
        id: `${standort.id}-${name.toLowerCase().replace(/[^a-z]/g, '')}`,
        name,
        standortId: standort.id,
        kapazitaet,
        lage: `${etage}. OG · ${standort.stadt}`,
        flaecheQm: Math.round(kapazitaet * 2.2 + 6),
        beschreibung: `Konferenzraum „${name}“ am Standort ${standort.name} – geeignet für bis zu ${kapazitaet} Personen.`,
        ausstattungIds,
        farbe: RAUM_FARBEN[lfd % RAUM_FARBEN.length],
      });
      lfd++;
    });
  }
  return raeume;
}

export const KONFERENZRAEUME: Konferenzraum[] = baueRaeume();

/** Der angemeldete INNOQ-Mitarbeiter (Persona: Alex Berger). */
export const AKTUELLER_MITARBEITER: Mitarbeiter = {
  id: 'alex-berger',
  name: 'Alex Berger',
  rolle: 'Senior Consultant',
  standortId: 'k',
  initialen: 'AB',
};

/**
 * Vorbelegte Raumbuchungen, damit Verfügbarkeit, Doppelbuchungs-
 * vermeidung und „Meine Buchungen“ direkt erlebbar sind.
 *
 * Die Daten sind relativ zum Startdatum der App, damit immer
 * aktuelle Buchungen sichtbar sind. Siehe `seedBuchungen()`.
 */
export function seedBuchungen(heute: Date): Raumbuchung[] {
  const iso = (offsetTage: number): string => {
    const d = new Date(heute);
    d.setDate(d.getDate() + offsetTage);
    return d.toISOString().slice(0, 10);
  };

  return [
    // Heute – belegte Zeitfenster für mehrere Räume (Köln).
    { id: 'b-1001', raumId: 'k-hamilton', standortId: 'k', mitarbeiter: 'Mara Lindqvist', datum: iso(0), startzeit: '09:00', endzeit: '10:30', titel: 'Sprint Planning', status: 'bestaetigt' },
    { id: 'b-1002', raumId: 'k-hamilton', standortId: 'k', mitarbeiter: 'Jens Brandt', datum: iso(0), startzeit: '13:00', endzeit: '14:00', titel: 'Architektur-Review', status: 'bestaetigt' },
    { id: 'b-1003', raumId: 'k-engelbart', standortId: 'k', mitarbeiter: 'Alex Berger', datum: iso(0), startzeit: '11:00', endzeit: '12:00', titel: 'Kunden-Workshop Vorbereitung', notiz: 'Beamer benötigt', status: 'bestaetigt' },
    // Diese Woche – Buchungen des aktuellen Mitarbeiters.
    { id: 'b-1004', raumId: 'k-cerf', standortId: 'k', mitarbeiter: 'Alex Berger', datum: iso(2), startzeit: '14:00', endzeit: '16:00', titel: 'Team-Retrospektive', status: 'bestaetigt' },
    { id: 'b-1005', raumId: 'be-neumann', standortId: 'be', mitarbeiter: 'Alex Berger', datum: iso(5), startzeit: '10:00', endzeit: '11:30', titel: 'Kundentermin Acme AG', notiz: 'VC mit Stuttgart', status: 'bestaetigt' },
    // Weitere fremde Buchungen für Verfügbarkeitsanzeige.
    { id: 'b-1006', raumId: 'mh-turing', standortId: 'mh', mitarbeiter: 'Sophie Krause', datum: iso(1), startzeit: '09:30', endzeit: '11:00', titel: 'Onboarding', status: 'bestaetigt' },
    { id: 'b-1007', raumId: 'mh-lovelace', standortId: 'mh', mitarbeiter: 'Tom Vogel', datum: iso(1), startzeit: '15:00', endzeit: '17:00', titel: 'Design Sprint', status: 'bestaetigt' },
    { id: 'b-1008', raumId: 'hh-torvalds', standortId: 'hh', mitarbeiter: 'Nina Hofmann', datum: iso(3), startzeit: '13:30', endzeit: '15:00', titel: 'Pairing Session', status: 'bestaetigt' },
  ];
}
