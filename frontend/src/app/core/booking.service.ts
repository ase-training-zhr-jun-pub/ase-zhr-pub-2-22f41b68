import { computed, Injectable, signal } from '@angular/core';
import { CURRENT_EMPLOYEE, seedBookings } from './mock-data';
import { RoomBooking, Availability } from './models';

/** Input data for a new room booking. */
export interface BookingRequest {
  roomId: string;
  locationId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  note?: string;
}

/** Converts "HH:mm" to minutes since midnight. */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Do two time windows on the same day overlap? */
function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}

/**
 * Manages room bookings in Signal state. Provides availability
 * checking and prevents double bookings
 * (Glossary: "Verfügbarkeit", "Doppelbuchung", "Buchungsübersicht").
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  /** Today's date – fixed once at startup (deterministic prototype). */
  readonly today = new Date();

  private readonly _bookings = signal<RoomBooking[]>(seedBookings(this.today));

  /** All bookings (read-only Signal). */
  readonly bookings = this._bookings.asReadonly();

  /** Bookings of the currently logged-in employee, in chronological order. */
  readonly myBookings = computed(() =>
    this._bookings()
      .filter((b) => b.employee === CURRENT_EMPLOYEE.name && b.status === 'confirmed')
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)),
  );

  /** Number of confirmed bookings for the current employee. */
  readonly myBookingCount = computed(() => this.myBookings().length);

  /** Today's date as an ISO string YYYY-MM-DD. */
  get todayIso(): string {
    return this.today.toISOString().slice(0, 10);
  }

  /** Confirmed bookings for a room on a given date (sorted). */
  bookingsForRoom(roomId: string, date: string): RoomBooking[] {
    return this._bookings()
      .filter((b) => b.roomId === roomId && b.date === date && b.status === 'confirmed')
      .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
  }

  /**
   * Checks the availability of a room for a time window and
   * returns any conflicting bookings.
   */
  checkAvailability(roomId: string, date: string, startTime: string, endTime: string): Availability {
    const conflicts = this.bookingsForRoom(roomId, date).filter((b) =>
      overlaps(startTime, endTime, b.startTime, b.endTime),
    );
    return { available: conflicts.length === 0, conflicts };
  }

  /**
   * Creates a new room booking – provided no double booking would result.
   * Throws on conflict.
   */
  bookRoom(request: BookingRequest): RoomBooking {
    if (toMinutes(request.endTime) <= toMinutes(request.startTime)) {
      throw new Error('End time must be after start time.');
    }
    const { available } = this.checkAvailability(
      request.roomId,
      request.date,
      request.startTime,
      request.endTime,
    );
    if (!available) {
      throw new Error('The room is already occupied in the selected time window.');
    }

    const booking: RoomBooking = {
      id: `b-${this.today.getFullYear()}${Math.floor(performance.now())}-${this._bookings().length}`,
      employee: CURRENT_EMPLOYEE.name,
      status: 'confirmed',
      ...request,
    };
    this._bookings.update((list) => [...list, booking]);
    return booking;
  }

  /** Cancels a booking (Glossary: Buchungsverwaltung). */
  cancel(bookingId: string): void {
    this._bookings.update((list) =>
      list.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)),
    );
  }
}
