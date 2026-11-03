import { DEV_CATEGORIES, DEV_QUESTIONS } from './dev';
import { GENERAL_CATEGORIES, GENERAL_QUESTIONS } from './general';
import type { Category, Difficulty, Mode, Question } from './types';

export type { Category, Difficulty, Mode, Question };

export const QUESTIONS: Question[] = [...DEV_QUESTIONS, ...GENERAL_QUESTIONS];
export const CATEGORIES: Category[] = [...DEV_CATEGORIES, ...GENERAL_CATEGORIES];

export const MODES: Record<Mode, { label: string; short: string; emoji: string; tagline: string }> = {
  dev: { label: 'Modo dev', short: 'Dev', emoji: '💻', tagline: 'HTML, CSS, JavaScript, TypeScript, accesibilidad, Git y web. Con fragmentos de código.' },
  general: { label: 'Cultura general', short: 'Cultura', emoji: '🧠', tagline: 'Geografía, historia, ciencia, arte, cine, música y deportes.' },
};

export const DIFFICULTIES: Record<Difficulty, { label: string; points: number }> = {
  facil: { label: 'Fácil', points: 100 },
  media: { label: 'Media', points: 150 },
  dificil: { label: 'Difícil', points: 200 },
};

export const categoriesOf = (mode: Mode) => CATEGORIES.filter((c) => c.mode === mode);
export const category = (id: string) => CATEGORIES.find((c) => c.id === id);
