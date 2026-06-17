import { Injectable } from '@angular/core';
import { AUSSTATTUNGEN, KONFERENZRAEUME, AKTUELLER_MITARBEITER, STANDORTE } from './mock-data';
import { Ausstattung, Konferenzraum, Mitarbeiter, Standort } from './models';

/**
 * Liefert die statischen Stammdaten (Standorte, Konferenzräume,
 * Ausstattung, Mitarbeiter). Read-only – Buchungen verwaltet der
 * {@link BookingService}.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly standorte = STANDORTE;
  private readonly raeume = KONFERENZRAEUME;
  private readonly ausstattungen = AUSSTATTUNGEN;

  /** Der aktuell angemeldete INNOQ-Mitarbeiter. */
  readonly aktuellerMitarbeiter: Mitarbeiter = AKTUELLER_MITARBEITER;

  getStandorte(): Standort[] {
    return this.standorte;
  }

  getStandort(id: string): Standort | undefined {
    return this.standorte.find((s) => s.id === id);
  }

  getAusstattungen(): Ausstattung[] {
    return this.ausstattungen;
  }

  getAusstattung(id: string): Ausstattung | undefined {
    return this.ausstattungen.find((a) => a.id === id);
  }

  /** Alle Räume, optional auf einen Standort eingegrenzt. */
  getRaeume(standortId?: string): Konferenzraum[] {
    return standortId ? this.raeume.filter((r) => r.standortId === standortId) : this.raeume;
  }

  getRaum(id: string): Konferenzraum | undefined {
    return this.raeume.find((r) => r.id === id);
  }

  /** Anzahl der Konferenzräume an einem Standort. */
  anzahlRaeume(standortId: string): number {
    return this.raeume.filter((r) => r.standortId === standortId).length;
  }
}
