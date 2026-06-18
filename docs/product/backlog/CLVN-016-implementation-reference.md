# CLVN-016 Implementation Reference

## Initial Prompt

> "Lets plan the next steps. I want story CLVN-016 to be implemented. Therefore we initially need:
> - Move all the mock data from the frontend into the backend
> - Provide the necessary CRUD and other API endpoints
> - Stick to Zalando API guidelines for REST endpoints
> - Implement the frontend services fully, calling data via HTTP
>
> Once the API and mock data is ready, how do we continue with CLVN-016?"

## Context

CLVN-016 ("Confirm Room Selection") is part of epic CLVN-015 ("Book Room"). Before it can be
implemented, the Angular prototype's mock data must be migrated to the Spring Boot backend and all
frontend services must be wired to call the backend via HTTP instead of reading local in-memory data.

This plan also supersedes **ADR-002** (resource data as mock in SPA), which explicitly deferred
a Resource Service. That decision is now reversed as part of this work.

---

## Execution Plan

### Phase 1 — Backend Infrastructure

**Files:** `backend/pom.xml`, `backend/src/main/resources/application.yml`

- Add `spring-boot-starter-data-jpa` and `h2` (runtime) to pom.xml
- Configure H2 file-mode datasource (`jdbc:h2:file:./data/calvin;AUTO_SERVER=TRUE`)
- JPA: `ddl-auto: create-drop` (re-seeds on every start, prototype)

### Phase 2 — Backend: Domain Entities + Repositories

Feature-based packages under `com.innoq.calvin.booking`:

| Package | Entity | Key fields |
|---------|--------|-----------|
| `location` | `LocationEntity` | id, name, city, country, abbreviation, address, headquarters |
| `equipment` | `EquipmentEntity` | id, name, icon |
| `room` | `RoomEntity` | id, name, locationId, capacity, floorInfo, areaSqm, description, color, `@ElementCollection equipmentIds` |
| `employee` | `EmployeeEntity` | id, name, role, homeLocationId, initials |
| `booking` | `BookingEntity` | id, `@Version version`, roomId, locationId, employee, date, startTime, endTime, title, note, status; `@UniqueConstraint(roomId, date, startTime)` |

### Phase 3 — Backend: Seed Data

`com.innoq.calvin.booking.seed.DataSeeder` (`ApplicationRunner`):
- Idempotent: bails if `locationRepository.count() > 0`
- Replicates `buildRooms()` from `mock-data.ts` (same deterministic IDs and room generation logic)
- Seeds 8 bookings with `LocalDate.now().plusDays(offset)` matching TS offsets
- Seeds 1 employee: Alex Berger (`alex-berger`)

### Phase 4 — Backend: REST Endpoints (Zalando guidelines)

Global: `GlobalExceptionHandler` → `ProblemDetail` (Spring Boot 4 RFC 7807) for 404 / 409.
CORS: `WebConfig` allows all origins, methods GET/POST/DELETE/PATCH/OPTIONS.

```
GET  /api/v1/locations                                                → 200 (includes roomCount)
GET  /api/v1/locations/{id}                                           → 200 | 404
GET  /api/v1/equipment                                                → 200
GET  /api/v1/equipment/{id}                                           → 200 | 404
GET  /api/v1/rooms                                                    → 200
GET  /api/v1/rooms?location-id=                                       → 200
GET  /api/v1/rooms/{id}                                               → 200 | 404
GET  /api/v1/employees/current                                        → 200
GET  /api/v1/availability?room-id=&date=&start-time=&end-time=        → 200 AvailabilityResponse
GET  /api/v1/bookings                                                 → 200 (current employee)
GET  /api/v1/bookings?room-id=&date=&status=confirmed                 → 200 (day view)
GET  /api/v1/bookings/{id}                                            → 200 | 404
POST /api/v1/bookings                                                 → 201 | 409
DELETE /api/v1/bookings/{id}                                          → 204 | 404
```

`BookingResponse` includes denormalized `roomName` + `locationName` to avoid N+1 on My Bookings.
`LocationResponse` includes `roomCount` to avoid N+1 on Locations page.

### Phase 5 — Frontend: Services → Async HTTP

**`CatalogService`** (`frontend/src/app/core/catalog.service.ts`):
- All methods return `Observable<T>` via `HttpClient` + `shareReplay(1)`
- Relative URLs (no leading slash): `api/v1/locations`, `api/v1/rooms?location-id=...`
- `currentEmployee` becomes `currentEmployee$: Observable<Employee>`

**`BookingService`** (`frontend/src/app/core/booking.service.ts`):
- `_bookings = signal<RoomBooking[]>([])` loaded from backend in constructor
- `bookRoom()`, `cancel()` are HTTP + optimistic Signal update via `tap()`
- `checkAvailability()`, `bookingsForRoom()` are HTTP GET
- `myBookings` / `myBookingCount` remain `computed()` from signal

### Phase 6 — Frontend: Component Updates

All components switch to `toSignal()` bridges (consistent with Signal-first codebase):

| Component | Key change |
|-----------|-----------|
| `find-rooms.ts` | `toSignal(catalog.getLocations())`, `filteredRooms` via `switchMap(locationId)` |
| `room-detail.ts` | `toSignal(catalog.getRoom())`, `dayBookings` / `availability` via `toObservable().switchMap()` |
| `locations.ts` | `roomCount` from `LocationResponse` field (no extra HTTP calls) |
| `home.ts` | `locationCount` / `roomCount` via `map(l => l.length)` |
| `my-bookings.ts` | `cancelBooking()` subscribes to Observable; room/location names from `BookingResponse` |
| `app.ts` | `employee` via `toSignal(catalog.currentEmployee$)` |

`mock-data.ts` — all imports removed from services; file deprecated.

### Phase 7 — CLVN-016: Confirm Room Selection UI

**`find-rooms.ts`:**

- `selectedRoom = signal<ConferenceRoom | null>(null)`
- `selectRoom(room)`: sets signal
- `confirmSelection()`: navigates to `/room/:id?date=&start=&end=`
- Direct `[routerLink]` removed from room cards

**`find-rooms.html`:**
- Room cards: `<div (click)="selectRoom(r)" role="button" tabindex="0" [class.room--selected]="selectedRoom()?.id === r.id">`
- Keyboard a11y: `(keydown.enter)` and `(keydown.space)` handlers
- Confirmation panel (below room grid, shown when `selectedRoom()` is set):
  - Room name, location, floor, capacity, area
  - Selected date + time (if `timeWindowValid()`)
  - "Confirm Selection →" button → `confirmSelection()`
  - "Cancel" → `selectedRoom.set(null)`

**`find-rooms.scss`:**
- `.room--selected`: petrol border + glow
- `.selection-panel` with slide-in animation

### Phase 8 — ADR + Tech Debt

- `docs/architecture/adrs/ADR-002-resource-data-as-mock-in-spa.md` → status: Superseded (2026-06-18)
- `docs/architecture/technical-debt.md` → TS-2 (no resource service) + TS-5 (in-memory bookings): resolved

---

## Why CLVN-017–020 Require Minimal Work

`room-detail` already implements:
- **CLVN-017** (booking note): `note` signal + textarea — present, no changes
- **CLVN-018** (meeting title): `title` signal + input — present, no changes
- **CLVN-019** (submit): `submitBooking()` calls `booking.bookRoom()` — just needs HTTP wiring + error reads `err.error?.detail`
- **CLVN-020** (confirmation): `confirmation` signal + panel — present, shows backend-issued booking ID after wiring

---

## Implementation Order

1. pom.xml + application.yml
2. JPA entities (5 packages)
3. Repositories (5 interfaces)
4. DataSeeder
5. Shared error types + GlobalExceptionHandler + WebConfig
6. LocationController + Service
7. EquipmentController + Service
8. RoomController + Service + availability endpoint
9. EmployeeController + Service
10. BookingController + Service
11. CatalogService rewrite (Angular)
12. BookingService rewrite (Angular)
13. Component updates (all 6 components)
14. CLVN-016 find-rooms selection UI
15. ADR-002 + technical-debt.md update

## Verification

```bash
# Backend
curl http://localhost:8081/api/v1/locations          # 8 locations with roomCount
curl http://localhost:8081/api/v1/rooms?location-id=k
curl http://localhost:8081/api/v1/bookings            # 8 seeded bookings
curl -X POST .../api/v1/bookings ...                  # 201
# Same again → 409 application/problem+json

# Frontend
# find-rooms: click room → panel; click "Confirm" → room-detail
# room-detail: submit → 201 → confirmation panel
# my-bookings: new booking appears with room/location names
```
