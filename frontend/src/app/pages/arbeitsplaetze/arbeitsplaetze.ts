import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Arbeitsplatzbuchung – laut Glossar/Produktvision eine geplante
 * Erweiterung für eine spätere Phase. Hier als Ausblick dargestellt.
 */
@Component({
  selector: 'clv-arbeitsplaetze',
  imports: [RouterLink],
  template: `
    <div class="clv-shell">
      <header class="clv-page-head">
        <p class="eyebrow">Ausblick</p>
        <h1>Arbeitsplätze</h1>
        <p class="lead">
          Die Buchung einzelner Arbeitsplätze ist als zukünftige Erweiterung von Calvin geplant.
        </p>
      </header>

      <div class="soon clv-card">
        <span class="soon__icon">🪑</span>
        <h2>Bald verfügbar</h2>
        <p>
          In einer späteren Phase kannst du hier nicht nur Konferenzräume, sondern auch
          einzelne <strong>Arbeitsplätze</strong> buchen und sehen, welche Kolleg:innen am
          gleichen Tag im Büro sind.
        </p>
        <ul class="soon__list">
          <li>🔖 Einzelne Arbeitsplätze reservieren</li>
          <li>👥 Anwesenheit von Kolleg:innen sehen</li>
          <li>📞 Telefonboxen für Remote-Calls buchen</li>
        </ul>
        <a routerLink="/raeume-finden" class="clv-btn clv-btn--accent">Bis dahin: Konferenzraum finden</a>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .soon {
        max-width: 640px;
        text-align: center;
        padding: 2.5rem 2rem;
      }
      .soon__icon { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
      .soon h2 { margin-bottom: 0.75rem; }
      .soon p { color: var(--clv-gray-600); margin: 0 auto 1.25rem; max-width: 48ch; }
      .soon__list {
        list-style: none;
        padding: 0;
        margin: 0 auto 1.75rem;
        display: inline-flex;
        flex-direction: column;
        gap: 0.5rem;
        text-align: left;
        color: var(--clv-gray-700);
      }
    `,
  ],
})
export class Arbeitsplaetze {}
