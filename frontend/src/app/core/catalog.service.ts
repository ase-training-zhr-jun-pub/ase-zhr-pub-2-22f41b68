import { Injectable } from '@angular/core';
import { EQUIPMENT_ITEMS, CONFERENCE_ROOMS, CURRENT_EMPLOYEE, LOCATIONS } from './mock-data';
import { Equipment, ConferenceRoom, Employee, Location } from './models';

/**
 * Provides static master data (locations, conference rooms,
 * equipment, employees). Read-only – bookings are managed by
 * {@link BookingService}.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly locations = LOCATIONS;
  private readonly rooms = CONFERENCE_ROOMS;
  private readonly equipment = EQUIPMENT_ITEMS;

  /** The currently logged-in INNOQ employee. */
  readonly currentEmployee: Employee = CURRENT_EMPLOYEE;

  getLocations(): Location[] {
    return this.locations;
  }

  getLocation(id: string): Location | undefined {
    return this.locations.find((s) => s.id === id);
  }

  getEquipment(): Equipment[] {
    return this.equipment;
  }

  getEquipmentById(id: string): Equipment | undefined {
    return this.equipment.find((e) => e.id === id);
  }

  /** All rooms, optionally filtered to a single location. */
  getRooms(locationId?: string): ConferenceRoom[] {
    return locationId ? this.rooms.filter((r) => r.locationId === locationId) : this.rooms;
  }

  getRoom(id: string): ConferenceRoom | undefined {
    return this.rooms.find((r) => r.id === id);
  }

  /** Number of conference rooms at a given location. */
  getRoomCount(locationId: string): number {
    return this.rooms.filter((r) => r.locationId === locationId).length;
  }
}
