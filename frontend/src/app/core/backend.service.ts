import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Zugriff auf den Booking-Service (Backend).
 *
 * Die URL ist **relativ** (kein führender Slash) und nutzt den
 * Proxy-Pfad `api/v1`. Dadurch funktioniert der Aufruf sowohl lokal
 * (`localhost:4200/api/v1/...`) als auch hinter dem Crucible-Proxy
 * (`…/proxy/4200/api/v1/...`). Der npm-/Dev-Server-Proxy leitet
 * `/api/v1` an den Booking-Service weiter und schreibt ihn auf `/api` um.
 */
@Injectable({ providedIn: 'root' })
export class BackendService {
  /** Relativer Basis-Pfad – wird vom Proxy auf den Booking-Service gemappt. */
  static readonly API_BASE = 'api/v1';

  private readonly http = inject(HttpClient);

  /** Ruft den Smoke-Endpunkt `/api/hello` auf und liefert den Text. */
  getHello(): Observable<string> {
    return this.http.get(`${BackendService.API_BASE}/hello`, { responseType: 'text' });
  }
}
