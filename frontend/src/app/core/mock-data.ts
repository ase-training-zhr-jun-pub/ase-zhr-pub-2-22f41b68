/**
 * Mock data for the Calvin prototype.
 *
 * There is (as yet) no backend – all data for every entity defined
 * in the glossary is provided here as static fixtures.
 */
import { Equipment, ConferenceRoom, Employee, RoomBooking, Location } from './models';

/** The eight INNOQ office locations (Glossary: "Multi-Standort"). */
export const LOCATIONS: Location[] = [
  { id: 'mh', name: 'Monheim', city: 'Monheim am Rhein', country: 'Germany', abbreviation: 'MH', address: 'Krischerstraße 100, 40789 Monheim am Rhein', headquarters: true },
  { id: 'be', name: 'Berlin', city: 'Berlin', country: 'Germany', abbreviation: 'BE', address: 'Ohlauer Straße 43, 10999 Berlin' },
  { id: 'hh', name: 'Hamburg', city: 'Hamburg', country: 'Germany', abbreviation: 'HH', address: 'Ludwig-Erhard-Straße 18, 20459 Hamburg' },
  { id: 'k', name: 'Köln', city: 'Köln', country: 'Germany', abbreviation: 'K', address: 'Im Mediapark 5, 50670 Köln' },
  { id: 'm', name: 'München', city: 'München', country: 'Germany', abbreviation: 'M', address: 'Sonnenstraße 19, 80331 München' },
  { id: 'zh', name: 'Zürich', city: 'Zürich', country: 'Switzerland', abbreviation: 'ZH', address: 'Förrlibuckstrasse 110, 8005 Zürich' },
  { id: 'baar', name: 'Baar', city: 'Baar', country: 'Switzerland', abbreviation: 'BA', address: 'Lindenstrasse 16, 6340 Baar' },
  { id: 'of', name: 'Offenbach', city: 'Offenbach am Main', country: 'Germany', abbreviation: 'OF', address: 'Kaiserstraße 39, 63065 Offenbach am Main' },
];

/** Known equipment features (Glossary: "Ausstattung"). */
export const EQUIPMENT_ITEMS: Equipment[] = [
  { id: 'bildschirm', name: 'Screen', icon: '🖥️' },
  { id: 'beamer', name: 'Projector', icon: '📽️' },
  { id: 'whiteboard', name: 'Whiteboard', icon: '🧑‍🏫' },
  { id: 'flipchart', name: 'Flipchart', icon: '📋' },
  { id: 'videokonferenz', name: 'Video conferencing', icon: '📹' },
  { id: 'telefonkonferenz', name: 'Phone conferencing', icon: '☎️' },
  { id: 'klimaanlage', name: 'Air conditioning', icon: '❄️' },
  { id: 'hdmi', name: 'HDMI port', icon: '🔌' },
  { id: 'barrierefrei', name: 'Accessible', icon: '♿' },
  { id: 'kaffee', name: 'Coffee machine', icon: '☕' },
];

/** Accent colors from the INNOQ palette for room tiles. */
const ROOM_COLORS = ['#004153', '#ff9c66', '#009999', '#ff4d67', '#fff019', '#005268', '#68ddc3', '#d01040'];

/**
 * Room names per location – pioneers of computer science, fitting for
 * the software consultancy INNOQ.
 */
const ROOM_THEMES: Record<string, string[]> = {
  mh: ['Turing', 'Lovelace', 'Hopper', 'Knuth', 'Dijkstra'],
  be: ['Neumann', 'Kay', 'Ritchie', 'Liskov'],
  hh: ['Torvalds', 'Wirth', 'Backus'],
  k: ['Hamilton', 'Engelbart', 'Cerf', 'Berners-Lee'],
  m: ['Shannon', 'Hoare', 'Allen'],
  zh: ['Wirth', 'Nygaard', 'Iverson'],
  baar: ['Floyd', 'Milner'],
  of: ['Goldberg', 'Sutherland', 'Codd'],
};

/**
 * Generates deterministic but varied conference rooms for all locations.
 */
function buildRooms(): ConferenceRoom[] {
  const capacities = [4, 6, 8, 10, 12, 16, 20];
  const equipmentPool = EQUIPMENT_ITEMS.map((e) => e.id);
  const rooms: ConferenceRoom[] = [];
  let count = 0;

  for (const location of LOCATIONS) {
    const names = ROOM_THEMES[location.id] ?? ['Alpha', 'Beta'];
    names.forEach((name, i) => {
      const capacity = capacities[(count + i) % capacities.length];
      // Deterministic, well-distributed equipment per room.
      const featureCount = 3 + ((count + i) % 5);
      const equipmentIds: string[] = [];
      for (let m = 0; m < featureCount; m++) {
        const id = equipmentPool[(count * 3 + i * 2 + m * 5) % equipmentPool.length];
        if (!equipmentIds.includes(id)) equipmentIds.push(id);
      }
      const floor = (i % 4) + 1;
      rooms.push({
        id: `${location.id}-${name.toLowerCase().replace(/[^a-z]/g, '')}`,
        name,
        locationId: location.id,
        capacity,
        floorInfo: `Floor ${floor} · ${location.city}`,
        areaSqm: Math.round(capacity * 2.2 + 6),
        description: `Conference room "${name}" at ${location.name} – suitable for up to ${capacity} people.`,
        equipmentIds,
        color: ROOM_COLORS[count % ROOM_COLORS.length],
      });
      count++;
    });
  }
  return rooms;
}

export const CONFERENCE_ROOMS: ConferenceRoom[] = buildRooms();

/** The currently logged-in INNOQ employee (Persona: Alex Berger). */
export const CURRENT_EMPLOYEE: Employee = {
  id: 'alex-berger',
  name: 'Alex Berger',
  role: 'Senior Consultant',
  homeLocationId: 'k',
  initials: 'AB',
};

/**
 * Pre-seeded room bookings so that availability, double-booking
 * prevention, and "My Bookings" can be experienced immediately.
 *
 * Dates are relative to the app start date so that bookings always
 * appear current. See `seedBookings()`.
 */
export function seedBookings(today: Date): RoomBooking[] {
  const iso = (offsetDays: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  };

  return [
    // Today – occupied time slots for several rooms (Köln).
    { id: 'b-1001', roomId: 'k-hamilton', locationId: 'k', employee: 'Mara Lindqvist', date: iso(0), startTime: '09:00', endTime: '10:30', title: 'Sprint Planning', status: 'confirmed' },
    { id: 'b-1002', roomId: 'k-hamilton', locationId: 'k', employee: 'Jens Brandt', date: iso(0), startTime: '13:00', endTime: '14:00', title: 'Architecture Review', status: 'confirmed' },
    { id: 'b-1003', roomId: 'k-engelbart', locationId: 'k', employee: 'Alex Berger', date: iso(0), startTime: '11:00', endTime: '12:00', title: 'Client Workshop Preparation', note: 'Projector needed', status: 'confirmed' },
    // This week – bookings by the current employee.
    { id: 'b-1004', roomId: 'k-cerf', locationId: 'k', employee: 'Alex Berger', date: iso(2), startTime: '14:00', endTime: '16:00', title: 'Team Retrospective', status: 'confirmed' },
    { id: 'b-1005', roomId: 'be-neumann', locationId: 'be', employee: 'Alex Berger', date: iso(5), startTime: '10:00', endTime: '11:30', title: 'Client Meeting Acme AG', note: 'VC with Stuttgart', status: 'confirmed' },
    // Additional bookings by others for availability display.
    { id: 'b-1006', roomId: 'mh-turing', locationId: 'mh', employee: 'Sophie Krause', date: iso(1), startTime: '09:30', endTime: '11:00', title: 'Onboarding', status: 'confirmed' },
    { id: 'b-1007', roomId: 'mh-lovelace', locationId: 'mh', employee: 'Tom Vogel', date: iso(1), startTime: '15:00', endTime: '17:00', title: 'Design Sprint', status: 'confirmed' },
    { id: 'b-1008', roomId: 'hh-torvalds', locationId: 'hh', employee: 'Nina Hofmann', date: iso(3), startTime: '13:30', endTime: '15:00', title: 'Pairing Session', status: 'confirmed' },
  ];
}
