import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { BookingService } from '../../core/booking.service';
import { Raumbuchung } from '../../core/models';
import { formatDatum } from '../../core/format';

/**
 * „Meine Buchungen“ – Übersicht aller eigenen Raumbuchungen mit
 * Stornierungsmöglichkeit (User Story Map: Buchungen verwalten).
 */
@Component({
  selector: 'clv-meine-buchungen',
  imports: [RouterLink],
  templateUrl: './meine-buchungen.html',
  styleUrl: './meine-buchungen.scss',
})
export class MeineBuchungen {
  private readonly catalog = inject(CatalogService);
  protected readonly booking = inject(BookingService);

  protected formatDatum = formatDatum;

  /** Kommende Buchungen ab heute. */
  protected readonly kommende = computed(() =>
    this.booking.meineBuchungen().filter((b) => b.datum >= this.booking.heuteIso),
  );

  /** Vergangene Buchungen. */
  protected readonly vergangene = computed(() =>
    this.booking.meineBuchungen().filter((b) => b.datum < this.booking.heuteIso).reverse(),
  );

  protected tag(iso: string): string {
    return iso.slice(8, 10);
  }
  protected monatKurz(iso: string): string {
    return new Intl.DateTimeFormat('de-DE', { month: 'short' }).format(new Date(iso + 'T00:00:00'));
  }

  protected raumName(id: string): string {
    return this.catalog.getRaum(id)?.name ?? id;
  }
  protected standortName(id: string): string {
    return this.catalog.getStandort(id)?.name ?? id;
  }

  protected stornieren(b: Raumbuchung): void {
    if (confirm(`Buchung „${b.titel}“ am ${formatDatum(b.datum)} wirklich stornieren?`)) {
      this.booking.storniere(b.id);
    }
  }
}
