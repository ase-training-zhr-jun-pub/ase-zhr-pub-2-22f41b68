/** Utility functions for English date formatting in the prototype. */

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const SHORT_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
});

/** "Tuesday, June 17, 2026" from an ISO date string. */
export function formatDate(iso: string): string {
  return DATE_FORMAT.format(new Date(iso + 'T00:00:00'));
}

/** "Tue, 06/17" from an ISO date string. */
export function formatDateShort(iso: string): string {
  return SHORT_DATE_FORMAT.format(new Date(iso + 'T00:00:00'));
}
