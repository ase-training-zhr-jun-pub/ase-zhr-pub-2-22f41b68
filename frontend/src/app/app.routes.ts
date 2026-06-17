import { Routes } from '@angular/router';

/**
 * Routes along the entities from the glossary:
 * Home, Location, ConferenceRoom (find + detail/booking),
 * RoomBooking ("My Bookings") and Workplace (future scope).
 * Lazy-loading per page keeps the initial bundle small.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Calvin · Room Booking at INNOQ',
  },
  {
    path: 'locations',
    loadComponent: () => import('./pages/locations/locations').then((m) => m.Locations),
    title: 'Locations · Calvin',
  },
  {
    path: 'find-rooms',
    loadComponent: () => import('./pages/find-rooms/find-rooms').then((m) => m.FindRooms),
    title: 'Find Rooms · Calvin',
  },
  {
    path: 'room/:id',
    loadComponent: () => import('./pages/room-detail/room-detail').then((m) => m.RoomDetail),
    title: 'Room Details · Calvin',
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./pages/my-bookings/my-bookings').then((m) => m.MyBookings),
    title: 'My Bookings · Calvin',
  },
  {
    path: 'workplaces',
    loadComponent: () => import('./pages/workplaces/workplaces').then((m) => m.Workplaces),
    title: 'Workplaces · Calvin',
  },
  { path: '**', redirectTo: '' },
];
