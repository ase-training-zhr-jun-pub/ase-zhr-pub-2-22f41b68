/**
 * Domain-Modell für Calvin.
 *
 * Die Begriffe folgen dem Ubiquitous Language aus
 * `docs/produkt/glossar.md`. Jede Entität ist eine eigene Schnittstelle,
 * die Beziehungen werden über IDs abgebildet.
 */

/** Länder, in denen INNOQ Standorte betreibt. */
export type Land = 'Deutschland' | 'Schweiz';

/**
 * Standort – einer der acht INNOQ-Bürostandorte.
 * (Glossar: „Standort“)
 */
export interface Standort {
  id: string;
  name: string;
  stadt: string;
  land: Land;
  /** Kurzkürzel, z. B. "MH" für Monheim. */
  kuerzel: string;
  adresse: string;
  /** Ist dies der Hauptsitz? */
  hauptsitz?: boolean;
}

/**
 * Ausstattung – ein technisches oder räumliches Merkmal eines
 * Konferenzraums. (Glossar: „Ausstattung“)
 */
export interface Ausstattung {
  id: string;
  name: string;
  /** Emoji als leichtgewichtiges Icon für den Prototyp. */
  icon: string;
}

/**
 * Konferenzraum – die zentrale buchbare Ressource in Calvin.
 * (Glossar: „Konferenzraum“)
 */
export interface Konferenzraum {
  id: string;
  name: string;
  standortId: string;
  /** Maximale Teilnehmerzahl. */
  kapazitaet: number;
  /** Lage des Raums am Standort, z. B. "2. OG, Nordflügel". */
  lage: string;
  flaecheQm: number;
  beschreibung: string;
  /** IDs der vorhandenen Ausstattungsmerkmale. */
  ausstattungIds: string[];
  /** Akzentfarbe für die visuelle Darstellung im Prototyp. */
  farbe: string;
}

/** Status einer Raumbuchung. */
export type BuchungsStatus = 'bestaetigt' | 'storniert';

/**
 * Raumbuchung – Reservierung eines Konferenzraums für einen
 * Zeitraum und Zweck. (Glossar: „Raumbuchung“)
 */
export interface Raumbuchung {
  id: string;
  raumId: string;
  standortId: string;
  /** Name des buchenden Mitarbeiters. */
  mitarbeiter: string;
  /** Datum im ISO-Format YYYY-MM-DD. */
  datum: string;
  /** Startzeit im Format HH:mm. */
  startzeit: string;
  /** Endzeit im Format HH:mm. */
  endzeit: string;
  titel: string;
  notiz?: string;
  status: BuchungsStatus;
}

/**
 * INNOQ-Mitarbeiter – die primäre Zielgruppe von Calvin.
 * (Glossar: „INNOQ-Mitarbeiter“)
 */
export interface Mitarbeiter {
  id: string;
  name: string;
  rolle: string;
  /** Heimat-Standort des Mitarbeiters. */
  standortId: string;
  initialen: string;
}

/**
 * Verfügbarkeitsergebnis für einen Raum in einem konkreten
 * Zeitfenster. (Glossar: „Verfügbarkeit“ / „Verfügbarkeitsanzeige“)
 */
export interface Verfuegbarkeit {
  verfuegbar: boolean;
  /** Buchungen, die mit dem angefragten Zeitfenster kollidieren. */
  konflikte: Raumbuchung[];
}
