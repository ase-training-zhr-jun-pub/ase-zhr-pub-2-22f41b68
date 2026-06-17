import { computed, Injectable, signal } from '@angular/core';
import { AKTUELLER_MITARBEITER, seedBuchungen } from './mock-data';
import { Raumbuchung, Verfuegbarkeit } from './models';

/** Eingabedaten für eine neue Raumbuchung. */
export interface BuchungsAnfrage {
  raumId: string;
  standortId: string;
  datum: string;
  startzeit: string;
  endzeit: string;
  titel: string;
  notiz?: string;
}

/** Wandelt "HH:mm" in Minuten seit Mitternacht um. */
function zuMinuten(zeit: string): number {
  const [h, m] = zeit.split(':').map(Number);
  return h * 60 + m;
}

/** Zwei Zeitfenster am selben Tag überschneiden sich? */
function ueberschneidet(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return zuMinuten(aStart) < zuMinuten(bEnd) && zuMinuten(bStart) < zuMinuten(aEnd);
}

/**
 * Verwaltet Raumbuchungen im Signal-State. Stellt die
 * Verfügbarkeitsanzeige bereit und verhindert Doppelbuchungen
 * (Glossar: „Verfügbarkeit“, „Doppelbuchung“, „Buchungsübersicht“).
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  /** Heutiges Datum – einmal beim Start fixiert (deterministischer Prototyp). */
  readonly heute = new Date();

  private readonly _buchungen = signal<Raumbuchung[]>(seedBuchungen(this.heute));

  /** Alle Buchungen (read-only Signal). */
  readonly buchungen = this._buchungen.asReadonly();

  /** Buchungen des aktuell angemeldeten Mitarbeiters, chronologisch. */
  readonly meineBuchungen = computed(() =>
    this._buchungen()
      .filter((b) => b.mitarbeiter === AKTUELLER_MITARBEITER.name && b.status === 'bestaetigt')
      .sort((a, b) => (a.datum + a.startzeit).localeCompare(b.datum + b.startzeit)),
  );

  /** Anzahl bestätigter Buchungen des aktuellen Mitarbeiters. */
  readonly anzahlMeineBuchungen = computed(() => this.meineBuchungen().length);

  /** Heutiges Datum als ISO-String YYYY-MM-DD. */
  get heuteIso(): string {
    return this.heute.toISOString().slice(0, 10);
  }

  /** Bestätigte Buchungen eines Raums an einem Datum (sortiert). */
  buchungenFuerRaum(raumId: string, datum: string): Raumbuchung[] {
    return this._buchungen()
      .filter((b) => b.raumId === raumId && b.datum === datum && b.status === 'bestaetigt')
      .sort((a, b) => zuMinuten(a.startzeit) - zuMinuten(b.startzeit));
  }

  /**
   * Prüft die Verfügbarkeit eines Raums für ein Zeitfenster und
   * liefert kollidierende Buchungen zurück.
   */
  pruefeVerfuegbarkeit(raumId: string, datum: string, startzeit: string, endzeit: string): Verfuegbarkeit {
    const konflikte = this.buchungenFuerRaum(raumId, datum).filter((b) =>
      ueberschneidet(startzeit, endzeit, b.startzeit, b.endzeit),
    );
    return { verfuegbar: konflikte.length === 0, konflikte };
  }

  /**
   * Legt eine neue Raumbuchung an – sofern keine Doppelbuchung
   * entsteht. Wirft bei Konflikt einen Fehler.
   */
  bucheRaum(anfrage: BuchungsAnfrage): Raumbuchung {
    if (zuMinuten(anfrage.endzeit) <= zuMinuten(anfrage.startzeit)) {
      throw new Error('Die Endzeit muss nach der Startzeit liegen.');
    }
    const { verfuegbar } = this.pruefeVerfuegbarkeit(
      anfrage.raumId,
      anfrage.datum,
      anfrage.startzeit,
      anfrage.endzeit,
    );
    if (!verfuegbar) {
      throw new Error('Der Raum ist im gewählten Zeitfenster bereits belegt.');
    }

    const buchung: Raumbuchung = {
      id: `b-${this.heute.getFullYear()}${Math.floor(performance.now())}-${this._buchungen().length}`,
      mitarbeiter: AKTUELLER_MITARBEITER.name,
      status: 'bestaetigt',
      ...anfrage,
    };
    this._buchungen.update((liste) => [...liste, buchung]);
    return buchung;
  }

  /** Storniert eine Buchung (Glossar: Buchungsverwaltung). */
  storniere(buchungId: string): void {
    this._buchungen.update((liste) =>
      liste.map((b) => (b.id === buchungId ? { ...b, status: 'storniert' } : b)),
    );
  }
}
