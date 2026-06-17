---
paths:
  - frontend/**/*
---
# Frontend Tech Stack

## Stack

- **Angular 22** – standalone components, no NgModule
- **TypeScript 6** – strict configuration (`tsconfig.app.json`)
- **SCSS** – component-local styling, global design tokens in `src/styles.scss` (CSS Custom Properties)
- **Angular Router** – client-side routing with lazy-loading per page
- **Angular Signals** – reactive state (no RxJS for UI state, only for HTTP)
- **Build:** `@angular/build:application` (esbuild for production, Vite dev server)
- **Tests:** Vitest + jsdom (no Karma)
- **Formatter:** Prettier

## Commands

| Action | Command |
|---|---|
| Start dev server | `npm start` |
| Production build | `npm run build` |
| Production build + static server (Crucible) | `npm run serve:proxy` |
| Run tests | `npm test` |
| Watch build (no server) | `npm run watch` |

## Conventions

- **Import paths:** use relative paths (no import alias like `@/`)
- **Page components** live in `src/app/pages/`
- **Core services** live in `src/app/core/`
- **Styling:** use CSS Custom Properties from `styles.scss` via `var(--clv-*)`, no literal values
- **No ShadCN, no Tailwind** – custom SCSS components with `clv-` prefix for shell elements
- **State management:** Angular Signals — no external state library, no RxJS subjects for UI state
