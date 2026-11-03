import { buildGame, points, type GameConfig, type GameQuestion } from './engine';
import type { GameRecord, Result } from './history.svelte';

export interface Answer {
  item: GameQuestion;
  choice: number | null;
  result: Result;
  ms: number;
  points: number;
}

export type Phase = 'question' | 'feedback' | 'results';

/** Una partida en curso: preguntas, temporizador, comodines y puntuación */
export class Game {
  config: GameConfig;
  questions = $state<GameQuestion[]>([]);
  reserve: GameQuestion[] = [];
  index = $state(0);
  phase = $state<Phase>('question');
  answers = $state<Answer[]>([]);
  hidden = $state<number[]>([]);
  fifty = $state(true);
  skip = $state(true);
  streak = $state(0);
  bestStreak = $state(0);
  score = $state(0);
  /** Milisegundos que quedan para responder (si hay tiempo) */
  left = $state(0);

  private shownAt = 0;
  private timer: ReturnType<typeof setInterval> | undefined;
  private onFinish: (record: GameRecord) => void;

  constructor(config: GameConfig, seed: number, onFinish: (record: GameRecord) => void) {
    this.config = config;
    this.onFinish = onFinish;
    const { questions, reserve } = buildGame(config, seed);
    this.questions = questions;
    this.reserve = reserve;
    this.start();
  }

  get current() {
    return this.questions[this.index];
  }

  get last() {
    return this.answers.at(-1);
  }

  get total() {
    return this.questions.length;
  }

  get correct() {
    return this.answers.filter((a) => a.result === 'ok').length;
  }

  get canSkip() {
    return this.skip && this.reserve.length > 0 && this.phase === 'question';
  }

  private get msTotal() {
    return this.config.time * 1000;
  }

  private start() {
    this.phase = 'question';
    this.hidden = [];
    this.shownAt = performance.now();
    this.left = this.msTotal;
    clearInterval(this.timer);
    if (this.msTotal) this.timer = setInterval(() => this.tick(), 100);
  }

  private tick() {
    this.left = Math.max(0, this.msTotal - (performance.now() - this.shownAt));
    if (this.left === 0) this.resolve(null);
  }

  answer(choice: number) {
    if (this.phase !== 'question' || this.hidden.includes(choice)) return;
    this.resolve(choice);
  }

  private resolve(choice: number | null) {
    clearInterval(this.timer);
    const ms = Math.min(performance.now() - this.shownAt, this.msTotal || Infinity);
    const item = this.current;
    const ok = choice === item.correct;
    let gained = 0;
    if (ok) {
      this.streak++;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
      gained = points(item.question.difficulty, this.msTotal - ms, this.msTotal, this.streak);
      this.score += gained;
    } else {
      this.streak = 0;
    }
    this.answers.push({ item, choice, result: ok ? 'ok' : choice === null ? 'time' : 'ko', ms, points: gained });
    this.phase = 'feedback';
  }

  /** Comodín 50:50: oculta dos respuestas incorrectas */
  useFifty() {
    if (!this.fifty || this.phase !== 'question') return;
    const wrong = [0, 1, 2, 3].filter((i) => i !== this.current.correct);
    const keep = wrong[Math.floor(Math.random() * wrong.length)];
    this.hidden = wrong.filter((i) => i !== keep);
    this.fifty = false;
  }

  /** Comodín Saltar: cambia la pregunta por otra sin perder la racha */
  useSkip() {
    if (!this.canSkip) return;
    const next = this.reserve.shift()!;
    this.questions[this.index] = next;
    this.skip = false;
    this.start();
  }

  next() {
    if (this.phase !== 'feedback') return;
    if (this.index + 1 < this.total) {
      this.index++;
      this.start();
    } else {
      this.phase = 'results';
      this.onFinish(this.record());
    }
  }

  destroy() {
    clearInterval(this.timer);
  }

  record(): GameRecord {
    const byCategory: Record<string, [number, number]> = {};
    for (const a of this.answers) {
      const acc = (byCategory[a.item.question.category] ??= [0, 0]);
      if (a.result === 'ok') acc[0]++;
      acc[1]++;
    }
    const c = this.config;
    return {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      at: new Date().toISOString(),
      mode: c.mode,
      category: c.category,
      difficulty: c.difficulty,
      daily: c.daily,
      score: this.score,
      correct: this.correct,
      total: this.answers.length,
      avgMs: this.answers.reduce((s, a) => s + a.ms, 0) / Math.max(1, this.answers.length),
      bestStreak: this.bestStreak,
      results: this.answers.map((a) => a.result),
      byCategory,
    };
  }
}
