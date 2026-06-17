import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Workplace booking – according to the Glossary/Product Vision a planned
 * extension for a later phase. Shown here as an outlook.
 */
@Component({
  selector: 'clv-workplaces',
  imports: [RouterLink],
  template: `
    <div class="clv-shell">
      <header class="clv-page-head">
        <p class="eyebrow">Outlook</p>
        <h1>Workplaces</h1>
        <p class="lead">
          Booking individual workplaces is planned as a future extension of Calvin.
        </p>
      </header>

      <div class="soon clv-card">
        <span class="soon__icon">🪑</span>
        <h2>Coming Soon</h2>
        <p>
          In a later phase you will be able to book not only conference rooms, but also
          individual <strong>workplaces</strong> and see which colleagues are in the office
          on the same day.
        </p>
        <ul class="soon__list">
          <li>🔖 Reserve individual workplaces</li>
          <li>👥 See colleagues' presence</li>
          <li>📞 Book phone booths for remote calls</li>
        </ul>
        <a routerLink="/raeume-finden" class="clv-btn clv-btn--accent">Until then: Find a Conference Room</a>
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
export class Workplaces {}
