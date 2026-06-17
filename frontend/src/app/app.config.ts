import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Hash-Routing (#/pfad): macht die App unabhängig vom Pfad-Präfix
    // eines Reverse-Proxys (z. B. Crucible „…/proxy/4200/“) und benötigt
    // serverseitig kein Route-Fallback.
    provideRouter(routes, withHashLocation()),
  ],
};
