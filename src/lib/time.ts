const pad = (n: number) => String(n).padStart(2, '0');

/** Fecha local en formato AAAA-MM-DD */
export function isoDate(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split('-').map(Number);
  return isoDate(new Date(y, m - 1, d + days));
}

/** 2026-10-31 → 31/10/2026 */
export function shortDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** 2026-10-31 → sábado 31 de octubre */
export function longDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAYS[date.getDay()]} ${d} de ${MONTHS[m - 1]}`;
}

/** Miles con punto, sin depender de Intl (igual en servidor y navegador) */
export function formatNumber(n: number) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatSeconds(ms: number) {
  return `${(ms / 1000).toFixed(1).replace('.', ',')} s`;
}
