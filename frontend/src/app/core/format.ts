/** Hilfsfunktionen zur deutschen Formatierung im Prototyp. */

const TAG_FORMAT = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const KURZ_FORMAT = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
});

/** "Dienstag, 17. Juni 2026" aus ISO-Datum. */
export function formatDatum(iso: string): string {
  return TAG_FORMAT.format(new Date(iso + 'T00:00:00'));
}

/** "Di, 17.06." aus ISO-Datum. */
export function formatDatumKurz(iso: string): string {
  return KURZ_FORMAT.format(new Date(iso + 'T00:00:00'));
}
