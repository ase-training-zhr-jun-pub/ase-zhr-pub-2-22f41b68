import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { BookingService } from '../../core/booking.service';
import { Konferenzraum } from '../../core/models';
import { formatDatum } from '../../core/format';

/**
 * „Räume finden“ – Kernfunktion des Prototyps.
 *
 * Vereint die User Stories CLVN-002 (Standort wählen),
 * CLVN-003 (verfügbare Räume anzeigen), CLVN-004 (Kapazitätsfilter)
 * und CLVN-005 (Ausstattungsfilter) sowie die Verfügbarkeitsprüfung
 * für ein gewähltes Zeitfenster.
 */
@Component({
  selector: 'clv-raeume-finden',
  imports: [FormsModule, RouterLink],
  templateUrl: './raeume-finden.html',
  styleUrl: './raeume-finden.scss',
})
export class RaeumeFinden {
  private readonly catalog = inject(CatalogService);
  private readonly booking = inject(BookingService);
  private readonly route = inject(ActivatedRoute);

  protected readonly standorte = this.catalog.getStandorte();
  protected readonly ausstattungen = this.catalog.getAusstattungen();

  /* ---- Filter-State (Signals) --------------------------------------- */
  protected readonly standortId = signal<string>(this.initialerStandort());
  protected readonly minKapazitaet = signal<number | null>(null);
  protected readonly gewaehlteAusstattung = signal<Set<string>>(new Set());
  protected readonly datum = signal<string>(this.booking.heuteIso);
  protected readonly startzeit = signal<string>('09:00');
  protected readonly endzeit = signal<string>('10:00');

  protected readonly heuteIso = this.booking.heuteIso;
  protected formatDatum = formatDatum;

  private initialerStandort(): string {
    const ausQuery = this.route.snapshot.queryParamMap.get('standort');
    return ausQuery ?? this.catalog.aktuellerMitarbeiter.standortId;
  }

  /** Gültiges Zeitfenster für die Verfügbarkeitsprüfung? */
  protected readonly zeitfensterGueltig = computed(
    () => !!this.datum() && !!this.startzeit() && !!this.endzeit() && this.startzeit() < this.endzeit(),
  );

  protected readonly gewaehlterStandort = computed(() => this.catalog.getStandort(this.standortId()));

  /** Räume des Standorts, gefiltert nach Kapazität und Ausstattung. */
  protected readonly gefilterteRaeume = computed<Konferenzraum[]>(() => {
    const min = this.minKapazitaet();
    const merkmale = this.gewaehlteAusstattung();
    return this.catalog
      .getRaeume(this.standortId())
      .filter((r) => (min == null || r.kapazitaet >= min))
      .filter((r) => [...merkmale].every((m) => r.ausstattungIds.includes(m)))
      .sort((a, b) => a.kapazitaet - b.kapazitaet);
  });

  protected readonly anzahlAktiveFilter = computed(
    () => (this.minKapazitaet() != null ? 1 : 0) + this.gewaehlteAusstattung().size,
  );

  /* ---- Aktionen ------------------------------------------------------ */
  protected toggleAusstattung(id: string): void {
    this.gewaehlteAusstattung.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  protected istGewaehlt(id: string): boolean {
    return this.gewaehlteAusstattung().has(id);
  }

  protected filterZuruecksetzen(): void {
    this.minKapazitaet.set(null);
    this.gewaehlteAusstattung.set(new Set());
  }

  /* ---- Pro-Raum-Informationen --------------------------------------- */
  protected verfuegbar(raum: Konferenzraum): boolean {
    return this.booking.pruefeVerfuegbarkeit(raum.id, this.datum(), this.startzeit(), this.endzeit()).verfuegbar;
  }

  protected anzahlBuchungenHeute(raum: Konferenzraum): number {
    return this.booking.buchungenFuerRaum(raum.id, this.datum()).length;
  }

  protected ausstattungIcon(id: string): string {
    return this.catalog.getAusstattung(id)?.icon ?? '•';
  }
  protected ausstattungName(id: string): string {
    return this.catalog.getAusstattung(id)?.name ?? id;
  }

  /** Query-Params, um das Zeitfenster an die Detail-/Buchungsseite zu übergeben. */
  protected detailParams(): Record<string, string> {
    return { datum: this.datum(), start: this.startzeit(), ende: this.endzeit() };
  }
}
