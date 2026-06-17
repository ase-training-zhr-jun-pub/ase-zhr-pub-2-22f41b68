import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';

/** Overview of all eight INNOQ locations (Glossary: "Standort"). */
@Component({
  selector: 'clv-locations',
  imports: [RouterLink],
  templateUrl: './locations.html',
  styleUrl: './locations.scss',
})
export class Locations {
  private readonly catalog = inject(CatalogService);

  protected readonly locations = this.catalog.getLocations();

  protected getRoomCount(locationId: string): number {
    return this.catalog.getRoomCount(locationId);
  }
}
