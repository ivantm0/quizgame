import { DIFFICULTIES, QUESTIONS, type Difficulty, type Mode, type Question } from './questions';

/** Configuración de una partida. Se lee y se escribe en la URL de /jugar */
export interface GameConfig {
  mode: Mode | 'mix';
  category: string | 'all';
  difficulty: Difficulty | 'mixta';
  length: number;
  /** Segundos por pregunta; 0 = sin tiempo */
  time: number;
  /** Fecha del reto diario (AAAA-MM-DD) o null en partidas libres */
  daily: string | null;
}

export interface GameQuestion {
  question: Question;
  options: string[];
  correct: number;
}

export const LENGTHS = [10, 15, 20];
export const TIMES = [
  { value: 0, label: 'Sin tiempo' },
  { value: 20, label: '20 s' },
  { value: 10, label: '10 s' },
];
export const DAILY_LENGTH = 10;
export const DAILY_TIME = 20;

/* ---------- Aleatoriedad con semilla: el reto diario es igual para todo el mundo ---------- */

export function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ---------- Selección de preguntas ---------- */

export function pool(config: Pick<GameConfig, 'mode' | 'category' | 'difficulty'>) {
  return QUESTIONS.filter(
    (q) =>
      (config.mode === 'mix' || q.mode === config.mode) &&
      (config.category === 'all' || q.category === config.category) &&
      (config.difficulty === 'mixta' || q.difficulty === config.difficulty),
  );
}

export function toGameQuestion(question: Question, random: () => number): GameQuestion {
  const options = shuffle(question.options, random);
  return { question, options, correct: options.indexOf(question.options[0]) };
}

/**
 * Prepara la partida: las preguntas a jugar y una reserva para el comodín «Saltar».
 * En dificultad mixta las preguntas van de fácil a difícil.
 */
export function buildGame(config: GameConfig, seed: number) {
  const random = rng(seed);
  const picked = shuffle(pool(config), random);
  const length = Math.min(config.length, picked.length);
  const order: Record<Difficulty, number> = { facil: 0, media: 1, dificil: 2 };
  const main = picked.slice(0, length);
  if (config.difficulty === 'mixta') main.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
  return {
    questions: main.map((q) => toGameQuestion(q, random)),
    reserve: picked.slice(length).map((q) => toGameQuestion(q, random)),
  };
}

export function dailyConfig(date: string): GameConfig {
  return { mode: 'mix', category: 'all', difficulty: 'mixta', length: DAILY_LENGTH, time: DAILY_TIME, daily: date };
}

/* ---------- Puntuación ---------- */

/** Multiplicador por racha: x1,5 desde 3 aciertos seguidos y x2 desde 5 */
export function streakMultiplier(streak: number) {
  return streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
}

/**
 * Puntos de un acierto: base según dificultad + bonus por rapidez (hasta 50),
 * multiplicado por la racha que se alcanza con ese acierto.
 */
export function points(difficulty: Difficulty, msLeft: number, msTotal: number, streak: number) {
  const speed = msTotal > 0 ? Math.round((50 * Math.max(0, msLeft)) / msTotal) : 0;
  return Math.round((DIFFICULTIES[difficulty].points + speed) * streakMultiplier(streak));
}

/* ---------- URL ---------- */

const MODES = ['dev', 'general', 'mix'];
const DIFFS = ['facil', 'media', 'dificil', 'mixta'];

export function configToParams(c: GameConfig) {
  const p = new URLSearchParams();
  if (c.daily) {
    p.set('reto', c.daily);
    return p;
  }
  p.set('modo', c.mode);
  if (c.category !== 'all') p.set('cat', c.category);
  if (c.difficulty !== 'mixta') p.set('dif', c.difficulty);
  p.set('n', String(c.length));
  p.set('t', String(c.time));
  return p;
}

export function paramsToConfig(p: URLSearchParams, today: string): GameConfig {
  if (p.has('reto')) return dailyConfig(today);
  const mode = (MODES.includes(p.get('modo') ?? '') ? p.get('modo') : 'dev') as GameConfig['mode'];
  const difficulty = (DIFFS.includes(p.get('dif') ?? '') ? p.get('dif') : 'mixta') as GameConfig['difficulty'];
  const cat = p.get('cat');
  const category = cat && QUESTIONS.some((q) => q.category === cat && (mode === 'mix' || q.mode === mode)) ? cat : 'all';
  const n = Number(p.get('n'));
  const t = Number(p.get('t'));
  return {
    mode,
    category,
    difficulty,
    // Puede ser menor que las opciones de la portada si los filtros dejan menos preguntas
    length: Number.isInteger(n) && n > 0 && n <= Math.max(...LENGTHS) ? n : 10,
    time: TIMES.some((x) => x.value === t) ? t : 20,
    daily: null,
  };
}
