export type Mode = 'dev' | 'general';
export type Difficulty = 'facil' | 'media' | 'dificil';

export interface Category {
  id: string;
  mode: Mode;
  label: string;
  emoji: string;
}

export interface Question {
  id: string;
  mode: Mode;
  category: string;
  difficulty: Difficulty;
  question: string;
  /** Fragmento de código opcional que acompaña a la pregunta */
  code?: string;
  /** La primera opción es la correcta; se barajan al jugar */
  options: [string, string, string, string];
  explanation: string;
}

/** Crea preguntas con un formato compacto: q(categoría, dificultad, enunciado, opciones, explicación, código) */
export function bank(mode: Mode) {
  let n = 0;
  return (
    category: string,
    difficulty: Difficulty,
    question: string,
    options: [string, string, string, string],
    explanation: string,
    code?: string,
  ): Question => ({ id: `${mode}-${category}-${++n}`, mode, category, difficulty, question, options, explanation, code });
}
