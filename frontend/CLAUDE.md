# Frontend – Calvin SPA

## Dokumentation

| Dokument | Pfad |
|----------|------|
| Architektur (arc42) | `docs/arc42/arc42.md` |
| ADR-001 Frontend + Booking Service | `docs/arc42/adrs/ADR-001-frontend-prototyp-und-booking-service.md` |
| ADR-002 Ressourcendaten als Mock-Daten | `docs/architektur/adrs/ADR-002-ressourcendaten-als-mock-in-der-spa.md` |
| ADR-003 Basic-Auth ohne Passwörter | `docs/architektur/adrs/ADR-003-authentifizierung-basic-auth-ohne-passwoerter.md` |
| Qualitätsanforderungen | `docs/architektur/qualitätsanforderungen/README.md` |
| Technische Schulden | `docs/architektur/technische-schulden.md` |
| Produkt-Backlog | `docs/produkt/backlog/backlog.md` |
| Glossar (Ubiquitous Language) | `docs/produkt/glossar.md` |

Halte dich immer an das Wording aus dem Glossar.

## Technologie

- **Angular 22** – Standalone-Komponenten, kein NgModule
- **TypeScript 6** – strikte Konfiguration (`tsconfig.app.json`)
- **SCSS** – komponentenlokales Styling, globale Design-Tokens in `src/styles.scss`
- **Angular Router** – clientseitiges Routing mit Lazy-Loading per Seite
- **Angular Signals** – reaktiver State (kein RxJS für UI-State, nur für HTTP)
- **Build:** `@angular/build:application` (esbuild für Production, Vite Dev-Server)
- **Tests:** Vitest + jsdom (kein Karma)
- **Formatter:** Prettier

## Ordner-Struktur

```
frontend/
├── angular.json                        # Build-Konfiguration (baseHref, proxyConfig …)
├── proxy.conf.json                     # Dev-Server: /api/v1 → localhost:8081
├── serve-static.mjs                    # Produktions-Staticserver + API-Proxy für Crucible
├── src/
│   ├── main.ts                         # Bootstrap
│   ├── styles.scss                     # Globale CSS Custom Properties (Design-Tokens)
│   └── app/
│       ├── app.ts                      # Root-Komponente (Shell: Header, Router-Outlet, Footer)
│       ├── app.html / app.scss         # Shell-Template und -Styles
│       ├── app.config.ts               # ApplicationConfig (Router, HttpClient)
│       ├── app.routes.ts               # Routen-Definition mit Lazy-Loading
│       ├── core/
│       │   ├── models.ts               # Domänen-Interfaces (Ubiquitous Language)
│       │   ├── mock-data.ts            # Stammdaten und Seed-Buchungen als Mock
│       │   ├── catalog.service.ts      # Stammdaten-Service (Standorte, Räume, Ausstattung)
│       │   ├── booking.service.ts      # Buchungs-State (Signals, Verfügbarkeit, Doppelbuchung)
│       │   ├── health.service.ts       # Backend-Health via Spring Actuator
│       │   └── format.ts              # Datums-/Zeit-Hilfsfunktionen
│       └── pages/
│           ├── home/                   # Startseite
│           ├── standorte/              # Standortübersicht
│           ├── raeume-finden/          # Raumsuche mit Filtern
│           ├── raum-detail/            # Raumdetails + Buchungsmaske
│           ├── meine-buchungen/        # Buchungsübersicht des Nutzers
│           └── arbeitsplaetze/         # Platzhalter (noch nicht implementiert)
└── dist/calvin/browser/               # Produktions-Build (gitignored)
```

## Architektur

### Standalone-Komponenten

Alle Komponenten sind standalone – kein `NgModule`. Abhängigkeiten werden direkt im
`imports`-Array der `@Component`-Dekoratoren deklariert.

### State-Management mit Signals

Kein externes State-Management. Reaktiver State über Angular Signals:

```typescript
// Signal anlegen
readonly backendUp = signal<boolean | null>(null);

// Computed Signal
readonly anzahlMeineBuchungen = computed(() => this.meineBuchungen().length);

// Signal lesen (im Template)
{{ backendUp() }}

// Signal schreiben
this.backendUp.set(true);
this._buchungen.update(liste => [...liste, neueBuchung]);
```

### Services

Services sind `providedIn: 'root'` und werden per `inject()` eingebunden:

```typescript
private readonly health = inject(HealthService);
```

- **`CatalogService`** – liefert Stammdaten aus `mock-data.ts` (read-only)
- **`BookingService`** – verwaltet Raumbuchungen im Signal-State (In-Memory, TS-5)
- **`HealthService`** – HTTP-Aufruf an Spring Actuator für Backend-Verbindungscheck

### HTTP-Calls

HTTP-Client ist mit `withFetch()` konfiguriert. **Alle URLs müssen relativ sein** –
kein führender Slash:

```typescript
// Richtig:
this.http.get<HealthStatus>('api/v1/actuator/health')

// Falsch (bricht hinter dem Crucible-Proxy):
this.http.get<HealthStatus>('/api/v1/actuator/health')
```

Relative URLs funktionieren sowohl hinter dem Crucible-Proxy als auch lokal.

### Routing

Hash-Routing (`withHashLocation()`) – URLs haben das Format `/#/raeume-finden`.
Dadurch werden serverseitige Route-Fallbacks überflüssig und die App funktioniert
korrekt hinter Pfad-Präfix-Proxys (Crucible).

Alle Routen laden ihre Seite lazy:

```typescript
{ path: 'standorte', loadComponent: () => import('./pages/standorte/standorte').then(m => m.Standorte) }
```

### Template-Syntax (Angular 17+)

Kontrollfluss mit `@if` / `@for` / `@else` (nicht `*ngIf` / `*ngFor`):

```html
@if (backendUp() === true) {
  <span>Backend verbunden</span>
} @else if (backendUp() === false) {
  <span>Backend nicht erreichbar</span>
}

@for (standort of standorte; track standort.id) {
  <li>{{ standort.name }}</li>
}
```

### Mock-Daten und Domänenmodell

Stammdaten (Standorte, Räume, Ausstattung) leben in `core/mock-data.ts` – kein
Resource-Service im Prototyp (ADR-002, TS-2). Der Booking Service arbeitet
ausschließlich mit IDs dieser Mock-Daten. Domänen-Interfaces in `core/models.ts`
folgen dem Ubiquitous Language aus dem Glossar.

## Wichtige Dateien

| Datei | Zweck |
|-------|-------|
| `angular.json` | `baseHref: "./"` (kritisch für Crucible), `proxyConfig`, Builder-Konfiguration |
| `proxy.conf.json` | Leitet `/api/v1/*` im Dev-Server an `localhost:8081` weiter |
| `serve-static.mjs` | Produktions-Staticserver für Crucible: liefert `dist/` und proxyt `/api/v1/*` |
| `src/styles.scss` | CSS Custom Properties (Design-Tokens): Farben, Typografie, Schatten, Radii |
| `src/app/core/models.ts` | Alle Domänen-Interfaces – hier nachschlagen, bevor neue Typen angelegt werden |
| `src/app/core/mock-data.ts` | Einzige Quelle der Stamm- und Seed-Daten |

## Wichtige Bash-Commands

```bash
# Dev-Server (lokal, Port 4200, mit API-Proxy via proxy.conf.json)
npm start

# Produktions-Build
npm run build

# Produktions-Build + Static-Server (für Crucible / Port 4200)
npm run serve:proxy

# Tests
npm test

# Build beobachten (watch, kein Server)
npm run watch
```

## Crucible-Proxy – kritische Hinweise

Die Crucible-Trainingsumgebung stellt die App unter einem Pfad-Präfix bereit:
`https://crucible.ch.innoq.io/t/<token>/s/<session>/proxy/4200/`

**Daher:**

1. **`ng serve` funktioniert nicht hinter Crucible.** Vite erzeugt absolute Asset-Pfade
   (`/main.js`), die den Proxy-Prefix umgehen → 404. Stattdessen immer
   `npm run serve:proxy` (Produktions-Build + `serve-static.mjs`) verwenden.

2. **`baseHref: "./"` in `angular.json` darf nicht entfernt werden.** Nur damit
   erzeugt esbuild relative `import('./chunk-X.js')`-Pfade statt absoluter.

3. **Hash-Routing (`withHashLocation()`) darf nicht entfernt werden.** Ohne es würde
   ein direkter Seitenaufruf ein 404 vom Static-Server zurückliefern.

4. **HTTP-URLs müssen relativ sein** (kein führender `/`), damit sie den Proxy-Prefix
   erben.

## CSS-Konventionen

CSS Custom Properties aus `styles.scss` verwenden, keine Literalwerte:

```scss
// Richtig:
color: var(--clv-petrol);
border-radius: var(--clv-radius);

// Falsch:
color: #004153;
border-radius: 6px;
```

Komponentenlokale Styles liegen in der jeweiligen `.scss`-Datei. Klassen folgen
BEM-ähnlichen Namenskonventionen mit `clv-`-Prefix für Shell-Elemente.

## Code Smells – nicht tun

- **`NgModule`** anlegen – alle Komponenten sind standalone
- **`*ngIf` / `*ngFor`** verwenden – stattdessen `@if` / `@for`
- **Konstruktor-Injection** (`constructor(private svc: MyService)`) – stattdessen `inject()`
- **Absolute HTTP-URLs** (`'/api/v1/...'`) – immer relative URLs (`'api/v1/...'`)
- **RxJS-Subjects für UI-State** – stattdessen Signals
- **Neue Stammdaten-Typen** in Komponenten definieren – gehören in `core/models.ts`
- **Buchungen direkt im Backend erstellen** – der `BookingService` ist noch In-Memory (TS-5); erst nach Backend-Anbindung umstellen
- **`ng serve` für Crucible** empfehlen – nicht funktionsfähig hinter dem Proxy
