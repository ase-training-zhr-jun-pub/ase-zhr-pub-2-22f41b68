import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { BookingService } from '../../core/booking.service';
import { formatDate } from '../../core/format';

/** Home page: product vision, key metrics, and entry points to entities. */
@Component({
  selector: 'clv-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly catalog = inject(CatalogService);
  protected readonly booking = inject(BookingService);

  protected readonly locationCount = this.catalog.getLocations().length;
  protected readonly roomCount = this.catalog.getRooms().length;

  /** The employee's next upcoming booking (from today onwards). */
  protected readonly nextBooking = computed(() => {
    const today = this.booking.todayIso;
    return this.booking.myBookings().find((b) => b.date >= today) ?? null;
  });

  protected roomName(roomId: string): string {
    return this.catalog.getRoom(roomId)?.name ?? roomId;
  }
  protected locationName(locationId: string): string {
    return this.catalog.getLocation(locationId)?.name ?? locationId;
  }
  protected formatDate = formatDate;
}
