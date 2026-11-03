import type { GameConfig } from './engine';
import { addDays, isoDate } from './time';

export type Result = 'ok' | 'ko' | 'time';

export interface GameRecord {
  id: string;
  /** Momento en que terminó la partida (ISO) */
  at: string;
  mode: GameConfig['mode'];
  category: string;
  difficulty: GameConfig['difficulty'];
  daily: string | null;
  score: number;
  correct: number;
  total: number;
  avgMs: number;
  bestStreak: number;
  results: Result[];
  /** Aciertos y preguntas por categoría: { js: [3, 4] } */
  byCategory: Record<string, [number, number]>;
}

const KEY = 'quesabes:history';
const MAX = 200;

/** Historial de partidas guardado en el navegador */
class History {
  games = $state<GameRecord[]>([]);
  ready = $state(false);

  init() {
    if (this.ready) return;
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) this.games = parsed;
    } catch {
      this.games = [];
    }
    this.ready = true;
  }

  add(record: GameRecord) {
    this.games = [record, ...this.games].slice(0, MAX);
    this.save();
  }

  clear() {
    this.games = [];
    this.save();
  }

  private save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.games));
    } catch {
      /* almacenamiento no disponible: el historial vive solo en esta pestaña */
    }
  }

  daily(date: string) {
    return this.games.find((g) => g.daily === date);
  }

  best(mode?: GameRecord['mode']) {
    return this.games.filter((g) => !mode || g.mode === mode).reduce((max, g) => Math.max(max, g.score), 0);
  }

  /** Días seguidos con el reto diario completado, contando hasta hoy (o ayer si hoy aún no se ha jugado) */
  dailyStreak(today = isoDate()) {
    const days = new Set(this.games.filter((g) => g.daily).map((g) => g.daily));
    let day = days.has(today) ? today : addDays(today, -1);
    let streak = 0;
    while (days.has(day)) {
      streak++;
      day = addDays(day, -1);
    }
    return streak;
  }

  get stats() {
    const games = this.games;
    const answered = games.reduce((s, g) => s + g.total, 0);
    const correct = games.reduce((s, g) => s + g.correct, 0);
    const byCategory: Record<string, [number, number]> = {};
    for (const g of games)
      for (const [cat, [c, t]] of Object.entries(g.byCategory)) {
        const acc = (byCategory[cat] ??= [0, 0]);
        acc[0] += c;
        acc[1] += t;
      }
    return {
      played: games.length,
      answered,
      accuracy: answered ? correct / answered : 0,
      bestScore: this.best(),
      bestStreak: games.reduce((m, g) => Math.max(m, g.bestStreak), 0),
      avgMs: answered ? games.reduce((s, g) => s + g.avgMs * g.total, 0) / answered : 0,
      byCategory,
    };
  }
}

export const history = new History();
