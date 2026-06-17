import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { BookingService } from '../../core/booking.service';
import { Raumbuchung } from '../../core/models';
import { formatDatum } from '../../core/format';

/**
 * Raumdetails einsehen (CLVN-006) und Raum buchen.
 *
 * Zeigt Kapazität, Ausstattung und Lage, die Tagesbelegung sowie ein
 * Buchungsformular mit Live-Verfügbarkeitsprüfung. Doppelbuchungen
 * werden verhindert (Glossar: „Doppelbuchung“, „Verfügbarkeit“).
 */
@Component({
  selector: 'clv-raum-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './raum-detail.html',
  styleUrl: './raum-detail.scss',
})
export class RaumDetail {
  private readonly catalog = inject(CatalogService);
  private readonly booking = inject(BookingService);
  private readonly route = inject(ActivatedRoute);

  private readonly raumId = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly raum = this.catalog.getRaum(this.raumId);
  protected readonly standort = this.raum ? this.catalog.getStandort(this.raum.standortId) : undefined;

  protected readonly heuteIso = this.booking.heuteIso;
  protected formatDatum = formatDatum;

  /* ---- Formular-State ------------------------------------------------ */
  protected readonly datum = signal<string>(this.route.snapshot.queryParamMap.get('datum') ?? this.booking.heuteIso);
  protected readonly startzeit = signal<string>(this.route.snapshot.queryParamMap.get('start') ?? '09:00');
  protected readonly endzeit = signal<string>(this.route.snapshot.queryParamMap.get('ende') ?? '10:00');
  protected readonly titel = signal<string>('');
  protected readonly notiz = signal<string>('');

  /** Erfolgreich angelegte Buchung (Buchungsbestätigung). */
  protected readonly bestaetigung = signal<Raumbuchung | null>(null);
  protected readonly fehler = signal<string | null>(null);

  /* ---- Abgeleiteter Zustand ----------------------------------------- */
  protected readonly tagesbelegung = computed(() =>
    this.booking.buchungenFuerRaum(this.raumId, this.datum()),
  );

  protected readonly zeitGueltig = computed(() => this.startzeit() < this.endzeit());

  protected readonly verfuegbarkeit = computed(() =>
    this.booking.pruefeVerfuegbarkeit(this.raumId, this.datum(), this.startzeit(), this.endzeit()),
  );

  protected readonly kannBuchen = computed(
    () => this.zeitGueltig() && this.verfuegbarkeit().verfuegbar && this.titel().trim().length > 0,
  );

  protected ausstattung() {
    return (this.raum?.ausstattungIds ?? []).map((id) => this.catalog.getAusstattung(id)).filter(Boolean);
  }

  /* ---- Aktionen ------------------------------------------------------ */
  protected absenden(): void {
    if (!this.raum) return;
    this.fehler.set(null);
    try {
      const buchung = this.booking.bucheRaum({
        raumId: this.raum.id,
        standortId: this.raum.standortId,
        datum: this.datum(),
        startzeit: this.startzeit(),
        endzeit: this.endzeit(),
        titel: this.titel().trim(),
        notiz: this.notiz().trim() || undefined,
      });
      this.bestaetigung.set(buchung);
    } catch (e) {
      this.fehler.set(e instanceof Error ? e.message : 'Die Buchung konnte nicht angelegt werden.');
    }
  }

  protected weitereBuchung(): void {
    this.bestaetigung.set(null);
    this.titel.set('');
    this.notiz.set('');
  }
}
