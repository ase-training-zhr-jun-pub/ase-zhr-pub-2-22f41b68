import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CatalogService } from './core/catalog.service';
import { BookingService } from './core/booking.service';

/**
 * Anwendungs-Shell: INNOQ-gebrandeter Kopfbereich mit der
 * Hauptnavigation. Die Navigationspunkte folgen den Entitäten aus
 * dem Glossar (Standort, Konferenzraum, Raumbuchung, Arbeitsplatz).
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly catalog = inject(CatalogService);
  protected readonly booking = inject(BookingService);

  protected readonly mitarbeiter = this.catalog.aktuellerMitarbeiter;
}
