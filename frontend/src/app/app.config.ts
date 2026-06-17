import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Hash-routing (#/path): makes the app independent of the path prefix
    // of a reverse proxy (e.g. Crucible “…/proxy/4200/”) and requires
    // no server-side route fallback.
    provideRouter(routes, withHashLocation()),
    // HTTP client for accessing the Booking Service (via the
    // npm/dev-server proxy at /api/v1).
    provideHttpClient(withFetch()),
  ],
};
