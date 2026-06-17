import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { BookingService } from '../../core/booking.service';
import { ConferenceRoom } from '../../core/models';
import { formatDate } from '../../core/format';

/**
 * "Find Rooms" – core feature of the prototype.
 *
 * Covers user stories CLVN-002 (select location),
 * CLVN-003 (show available rooms), CLVN-004 (capacity filter)
 * and CLVN-005 (equipment filter) as well as availability checking
 * for a selected time window.
 */
@Component({
  selector: 'clv-find-rooms',
  imports: [FormsModule, RouterLink],
  templateUrl: './find-rooms.html',
  styleUrl: './find-rooms.scss',
})
export class FindRooms {
  private readonly catalog = inject(CatalogService);
  private readonly booking = inject(BookingService);
  private readonly route = inject(ActivatedRoute);

  protected readonly locations = this.catalog.getLocations();
  protected readonly equipment = this.catalog.getEquipment();

  /* ---- Filter state (Signals) --------------------------------------- */
  protected readonly locationId = signal<string>(this.initialLocation());
  protected readonly minCapacity = signal<number | null>(null);
  protected readonly selectedEquipment = signal<Set<string>>(new Set());
  protected readonly date = signal<string>(this.booking.todayIso);
  protected readonly startTime = signal<string>('09:00');
  protected readonly endTime = signal<string>('10:00');

  protected readonly todayIso = this.booking.todayIso;
  protected formatDate = formatDate;

  private initialLocation(): string {
    const fromQuery = this.route.snapshot.queryParamMap.get('location');
    return fromQuery ?? this.catalog.currentEmployee.locationId;
  }

  /** Is the time window valid for availability checking? */
  protected readonly timeWindowValid = computed(
    () => !!this.date() && !!this.startTime() && !!this.endTime() && this.startTime() < this.endTime(),
  );

  protected readonly selectedLocation = computed(() => this.catalog.getLocation(this.locationId()));

  /** Rooms at the selected location, filtered by capacity and equipment. */
  protected readonly filteredRooms = computed<ConferenceRoom[]>(() => {
    const min = this.minCapacity();
    const features = this.selectedEquipment();
    return this.catalog
      .getRooms(this.locationId())
      .filter((r) => (min == null || r.kapazitaet >= min))
      .filter((r) => [...features].every((m) => r.ausstattungIds.includes(m)))
      .sort((a, b) => a.kapazitaet - b.kapazitaet);
  });

  protected readonly activeFilterCount = computed(
    () => (this.minCapacity() != null ? 1 : 0) + this.selectedEquipment().size,
  );

  /* ---- Actions ------------------------------------------------------ */
  protected toggleEquipment(id: string): void {
    this.selectedEquipment.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  protected isSelected(id: string): boolean {
    return this.selectedEquipment().has(id);
  }

  protected resetFilters(): void {
    this.minCapacity.set(null);
    this.selectedEquipment.set(new Set());
  }

  /* ---- Per-room information --------------------------------------- */
  protected isAvailable(room: ConferenceRoom): boolean {
    return this.booking.checkAvailability(room.id, this.date(), this.startTime(), this.endTime()).verfuegbar;
  }

  protected getBookingCountToday(room: ConferenceRoom): number {
    return this.booking.bookingsForRoom(room.id, this.date()).length;
  }

  protected equipmentIcon(id: string): string {
    return this.catalog.getEquipmentById(id)?.icon ?? '•';
  }
  protected equipmentName(id: string): string {
    return this.catalog.getEquipmentById(id)?.name ?? id;
  }

  /** Query params to pass the time window to the detail/booking page. */
  protected detailParams(): Record<string, string> {
    return { datum: this.date(), start: this.startTime(), ende: this.endTime() };
  }
}
