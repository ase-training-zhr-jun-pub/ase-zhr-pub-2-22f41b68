import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Hash-Routing (#/pfad): macht die App unabhängig vom Pfad-Präfix
    // eines Reverse-Proxys (z. B. Crucible „…/proxy/4200/“) und benötigt
    // serverseitig kein Route-Fallback.
    provideRouter(routes, withHashLocation()),
    // HTTP-Client für den Zugriff auf den Booking-Service (über den
    // npm-/Dev-Server-Proxy unter /api/v1).
    provideHttpClient(withFetch()),
  ],
};
