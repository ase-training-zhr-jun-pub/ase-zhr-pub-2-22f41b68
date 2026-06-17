import { Routes } from '@angular/router';

/**
 * Routing entlang der Entitäten aus dem Glossar:
 * Startseite, Standort, Konferenzraum (finden + Detail/Buchung),
 * Raumbuchung („Meine Buchungen“) und Arbeitsplatz (Ausblick).
 * Lazy-Loading je Seite hält das Initial-Bundle klein.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Calvin · Raumbuchung bei INNOQ',
  },
  {
    path: 'standorte',
    loadComponent: () => import('./pages/standorte/standorte').then((m) => m.Standorte),
    title: 'Standorte · Calvin',
  },
  {
    path: 'raeume-finden',
    loadComponent: () => import('./pages/raeume-finden/raeume-finden').then((m) => m.RaeumeFinden),
    title: 'Räume finden · Calvin',
  },
  {
    path: 'raum/:id',
    loadComponent: () => import('./pages/raum-detail/raum-detail').then((m) => m.RaumDetail),
    title: 'Raumdetails · Calvin',
  },
  {
    path: 'meine-buchungen',
    loadComponent: () => import('./pages/meine-buchungen/meine-buchungen').then((m) => m.MeineBuchungen),
    title: 'Meine Buchungen · Calvin',
  },
  {
    path: 'arbeitsplaetze',
    loadComponent: () => import('./pages/arbeitsplaetze/arbeitsplaetze').then((m) => m.Arbeitsplaetze),
    title: 'Arbeitsplätze · Calvin',
  },
  { path: '**', redirectTo: '' },
];
