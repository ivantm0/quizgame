import type { GameRecord } from './history.svelte';
import { MODES, category } from './questions';
import { formatNumber, shortDate } from './time';

const SQUARES = { ok: '🟩', ko: '🟥', time: '⬛' } as const;

export const SITE_URL = 'https://quesabes-quiz.netlify.app';

/** Texto para compartir el resultado, con una fila de cuadrados por pregunta */
export function shareText(g: GameRecord) {
  const title = g.daily
    ? `QuéSabes · Reto del ${shortDate(g.daily)}`
    : `QuéSabes · ${g.mode === 'mix' ? 'Mixto' : MODES[g.mode].label}${g.category !== 'all' ? ` · ${category(g.category)?.label}` : ''}`;
  const grid = g.results.map((r) => SQUARES[r]).join('');
  return `${title}\n${grid}\n${g.correct}/${g.total} · ${formatNumber(g.score)} puntos\n${SITE_URL}`;
}

/** Usa el menú nativo de compartir si existe; si no, copia al portapapeles */
export async function share(text: string): Promise<'shared' | 'copied' | 'error'> {
  try {
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      await navigator.share({ text });
      return 'shared';
    }
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'error';
  }
}
