import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { BookingService } from '../../core/booking.service';
import { RoomBooking } from '../../core/models';
import { formatDate } from '../../core/format';

/**
 * View room details (CLVN-006) and book a room.
 *
 * Displays capacity, equipment and location, the day's occupancy, and a
 * booking form with live availability checking. Double bookings are
 * prevented (Glossary: "Doppelbuchung", "Verfügbarkeit").
 */
@Component({
  selector: 'clv-room-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './room-detail.html',
  styleUrl: './room-detail.scss',
})
export class RoomDetail {
  private readonly catalog = inject(CatalogService);
  private readonly booking = inject(BookingService);
  private readonly route = inject(ActivatedRoute);

  private readonly roomId = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly room = this.catalog.getRoom(this.roomId);
  protected readonly location = this.room ? this.catalog.getLocation(this.room.standortId) : undefined;

  protected readonly todayIso = this.booking.todayIso;
  protected formatDate = formatDate;

  /* ---- Form state ---------------------------------------------------- */
  protected readonly date = signal<string>(this.route.snapshot.queryParamMap.get('datum') ?? this.booking.todayIso);
  protected readonly startTime = signal<string>(this.route.snapshot.queryParamMap.get('start') ?? '09:00');
  protected readonly endTime = signal<string>(this.route.snapshot.queryParamMap.get('ende') ?? '10:00');
  protected readonly title = signal<string>('');
  protected readonly note = signal<string>('');

  /** Successfully created booking (booking confirmation). */
  protected readonly confirmation = signal<RoomBooking | null>(null);
  protected readonly error = signal<string | null>(null);

  /* ---- Derived state ----------------------------------------- */
  protected readonly dayBookings = computed(() =>
    this.booking.bookingsForRoom(this.roomId, this.date()),
  );

  protected readonly timeValid = computed(() => this.startTime() < this.endTime());

  protected readonly availability = computed(() =>
    this.booking.checkAvailability(this.roomId, this.date(), this.startTime(), this.endTime()),
  );

  protected readonly canBook = computed(
    () => this.timeValid() && this.availability().verfuegbar && this.title().trim().length > 0,
  );

  protected equipment() {
    return (this.room?.ausstattungIds ?? []).map((id) => this.catalog.getEquipmentById(id)).filter(Boolean);
  }

  /* ---- Actions ------------------------------------------------------ */
  protected submitBooking(): void {
    if (!this.room) return;
    this.error.set(null);
    try {
      const booking = this.booking.bookRoom({
        raumId: this.room.id,
        standortId: this.room.standortId,
        datum: this.date(),
        startzeit: this.startTime(),
        endzeit: this.endTime(),
        titel: this.title().trim(),
        notiz: this.note().trim() || undefined,
      });
      this.confirmation.set(booking);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'The booking could not be created.');
    }
  }

  protected resetBooking(): void {
    this.confirmation.set(null);
    this.title.set('');
    this.note.set('');
  }
}
