<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { history } from '$lib/history.svelte';
  import { configToParams, LENGTHS, pool, TIMES, DAILY_LENGTH, type GameConfig } from '$lib/engine';
  import { categoriesOf, DIFFICULTIES, MODES, QUESTIONS, type Mode } from '$lib/questions';
  import { formatNumber, isoDate, longDate } from '$lib/time';

  const PREFS = 'quesabes:prefs';

  let mode = $state<Mode>('dev');
  let cat = $state<string>('all');
  let difficulty = $state<GameConfig['difficulty']>('mixta');
  let length = $state(10);
  let time = $state(20);

  let today = $state('');
  onMount(() => {
    today = isoDate();
    try {
      const p = JSON.parse(localStorage.getItem(PREFS) ?? '{}');
      if (p.mode in MODES) mode = p.mode;
      if (typeof p.cat === 'string') cat = p.cat;
      if (p.difficulty) difficulty = p.difficulty;
      if (LENGTHS.includes(p.length)) length = p.length;
      if (TIMES.some((t) => t.value === p.time)) time = p.time;
    } catch {
      /* sin preferencias guardadas */
    }
  });

  const categories = $derived(categoriesOf(mode));
  const available = $derived(pool({ mode, category: cat, difficulty }).length);
  const playedToday = $derived(today ? history.daily(today) : undefined);
  const streak = $derived(today && history.ready ? history.dailyStreak(today) : 0);

  function pickMode(m: Mode) {
    if (m === mode) return;
    mode = m;
    cat = 'all';
  }

  function start() {
    const config: GameConfig = { mode, category: cat, difficulty, length: Math.min(length, available), time, daily: null };
    try {
      localStorage.setItem(PREFS, JSON.stringify({ mode, cat, difficulty, length, time }));
    } catch {
      /* no pasa nada si no se guardan */
    }
    goto(`/jugar?${configToParams(config)}`);
  }

  const counts = (m: Mode) => QUESTIONS.filter((q) => q.mode === m).length;
</script>

<svelte:head>
  <title>QuéSabes · Juego de preguntas para devs y cultura general</title>
  <meta name="description" content="Juego de preguntas con modo dev (HTML, CSS, JavaScript, TypeScript, accesibilidad) y modo cultura general. Reto diario, comodines, rachas y estadísticas." />
</svelte:head>

<section class="container hero">
  <div class="hero-text">
    <p class="eyebrow">Juego de preguntas · {QUESTIONS.length} preguntas</p>
    <h1>¿Cuánto <span class="hl">sabes</span> de verdad?</h1>
    <p class="lead muted">
      Elige entre el modo dev y cultura general, responde contra el reloj y encadena aciertos para multiplicar tus
      puntos. Cada respuesta viene con su explicación.
    </p>
  </div>

  <a href="/jugar?reto" class="daily card" class:done={playedToday}>
    <span class="daily-badge">Reto diario</span>
    <strong>{playedToday ? 'Ya has jugado hoy' : `${DAILY_LENGTH} preguntas mezcladas`}</strong>
    <span class="muted small">
      {today ? `${longDate(today)} · ` : ''}igual para todo el mundo, un intento al día
    </span>
    <span class="daily-foot">
      {#if playedToday}
        <span>{playedToday.correct}/{playedToday.total} · {formatNumber(playedToday.score)} pts</span>
        <span class="link">Ver resultado →</span>
      {:else}
        <span>{streak ? `🔥 Racha de ${streak} ${streak === 1 ? 'día' : 'días'}` : 'Empieza tu racha'}</span>
        <span class="link">Jugar →</span>
      {/if}
    </span>
  </a>
</section>

<section class="container setup" data-mode={mode} aria-labelledby="setup-title">
  <h2 id="setup-title" class="sr-only">Configura tu partida</h2>

  <div class="modes" role="radiogroup" aria-label="Modo de juego">
    {#each Object.entries(MODES) as [id, m] (id)}
      <button
        type="button"
        role="radio"
        aria-checked={mode === id}
        class="mode card"
        data-mode={id}
        onclick={() => pickMode(id as Mode)}
      >
        <span class="mode-emoji" aria-hidden="true">{m.emoji}</span>
        <span class="mode-name">{m.label}</span>
        <span class="muted small">{m.tagline}</span>
        <span class="mode-meta">{counts(id as Mode)} preguntas{#if history.best(id as Mode)} · récord {formatNumber(history.best(id as Mode))}{/if}</span>
      </button>
    {/each}
  </div>

  <div class="options card">
    <fieldset>
      <legend>Categoría</legend>
      <div class="chips">
        <label class="chip">
          <input type="radio" name="cat" value="all" bind:group={cat} />
          <span>✨ Todas</span>
        </label>
        {#each categories as c (c.id)}
          <label class="chip">
            <input type="radio" name="cat" value={c.id} bind:group={cat} />
            <span>{c.emoji} {c.label}</span>
          </label>
        {/each}
      </div>
    </fieldset>

    <div class="row">
      <fieldset>
        <legend>Dificultad</legend>
        <div class="seg">
          <label><input type="radio" name="dif" value="mixta" bind:group={difficulty} /><span>Mixta</span></label>
          {#each Object.entries(DIFFICULTIES) as [id, d] (id)}
            <label><input type="radio" name="dif" value={id} bind:group={difficulty} /><span>{d.label}</span></label>
          {/each}
        </div>
      </fieldset>

      <fieldset>
        <legend>Preguntas</legend>
        <div class="seg">
          {#each LENGTHS as n (n)}
            <label><input type="radio" name="len" value={n} bind:group={length} /><span>{n}</span></label>
          {/each}
        </div>
      </fieldset>

      <fieldset>
        <legend>Tiempo por pregunta</legend>
        <div class="seg">
          {#each TIMES as t (t.value)}
            <label><input type="radio" name="time" value={t.value} bind:group={time} /><span>{t.label}</span></label>
          {/each}
        </div>
      </fieldset>
    </div>

    <div class="go">
      <p class="muted small" aria-live="polite">
        {#if available < length}
          Con estos filtros hay {available} preguntas: la partida tendrá {available}.
        {:else}
          {available} preguntas disponibles con estos filtros.
        {/if}
      </p>
      <button type="button" class="btn btn-primary btn-lg" onclick={start} disabled={available === 0}>Empezar partida</button>
    </div>
  </div>
</section>

<section class="container how" aria-labelledby="how-title">
  <h2 id="how-title">Cómo se juega</h2>
  <ul>
    <li class="card"><b>🎯 Puntos</b><span class="muted">100, 150 o 200 según la dificultad, más hasta 50 por responder rápido.</span></li>
    <li class="card"><b>🔥 Rachas</b><span class="muted">Con 3 aciertos seguidos ganas x1,5 y con 5, el doble.</span></li>
    <li class="card"><b>🃏 Comodines</b><span class="muted">Un 50:50 y un salto por partida. Saltar no rompe la racha.</span></li>
    <li class="card"><b>⌨️ Teclado</b><span class="muted">Responde con 1–4 o A–D y pasa con Enter.</span></li>
  </ul>
</section>

<style>
  .hero { display: grid; grid-template-columns: 1.4fr 1fr; gap: 32px; align-items: end; padding: 56px 0 36px; }
  h1 { font-size: clamp(42px, 7vw, 84px); }
  .hl { position: relative; z-index: 0; white-space: nowrap; }
  .hl::after { content: ''; position: absolute; z-index: -1; left: -4px; right: -4px; bottom: 0.08em; height: 0.36em; background: var(--yellow); border-radius: 4px; transform: rotate(-1.5deg); }
  .lead { margin-top: 18px; max-width: 56ch; font-size: 19px; }

  .daily { display: flex; flex-direction: column; gap: 6px; padding: 22px; text-decoration: none; background: var(--yellow); transition: transform 0.15s, box-shadow 0.15s; }
  .daily:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--ink); }
  .daily.done { background: var(--surface); }
  .daily-badge { align-self: flex-start; padding: 2px 10px; border: 2px solid var(--ink); border-radius: 999px; background: var(--surface); font-size: 13px; font-weight: 700; }
  .daily strong { font-size: 24px; letter-spacing: -0.01em; }
  .daily .muted { color: rgb(28 26 46 / 0.7); }
  .daily-foot { display: flex; justify-content: space-between; gap: 12px; margin-top: 10px; padding-top: 12px; border-top: 2px dashed rgb(28 26 46 / 0.3); font-weight: 600; }
  .link { font-weight: 800; }

  .modes { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .mode { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 22px; text-align: left; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s, background 0.15s; }
  .mode:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--ink); }
  .mode[aria-checked='true'] { background: var(--accent-soft); outline: 3px solid var(--accent); outline-offset: -7px; }
  .mode-emoji { font-size: 36px; line-height: 1; }
  .mode-name { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
  .mode-meta { margin-top: auto; padding-top: 8px; font-size: 14px; font-weight: 700; color: var(--accent); }

  .options { padding: 24px; display: flex; flex-direction: column; gap: 22px; }
  fieldset { margin: 0; padding: 0; border: 0; min-width: 0; }
  legend { margin-bottom: 10px; padding: 0; font-weight: 700; font-size: 15px; }
  .row { display: flex; flex-wrap: wrap; gap: 22px 32px; }

  input[type='radio'] { position: absolute; opacity: 0; pointer-events: none; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip span { display: inline-block; padding: 8px 14px; border: 2px solid var(--ink); border-radius: 999px; background: var(--surface); font-weight: 600; font-size: 15px; cursor: pointer; transition: background 0.15s; }
  .chip span:hover { background: var(--accent-soft); }
  .chip input:checked + span { background: var(--ink); color: var(--bg); }
  .chip input:focus-visible + span, .seg input:focus-visible + span { outline: 3px solid var(--accent); outline-offset: 2px; }

  .seg { display: inline-flex; border: 2px solid var(--ink); border-radius: 999px; overflow: hidden; background: var(--surface); }
  .seg label + label span { border-left: 2px solid var(--ink); }
  .seg span { display: block; padding: 8px 16px; font-weight: 600; font-size: 15px; cursor: pointer; white-space: nowrap; }
  .seg span:hover { background: var(--accent-soft); }
  .seg input:checked + span { background: var(--accent); color: #fff; }

  .go { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding-top: 18px; border-top: 2px dashed var(--line); }

  .how { padding: 56px 0 24px; }
  .how h2 { font-size: 32px; margin-bottom: 18px; }
  .how ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .how li { display: flex; flex-direction: column; gap: 6px; padding: 18px; box-shadow: var(--shadow-sm); }
  .how b { font-size: 18px; }
  .how .muted { font-size: 15px; }

  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; padding-top: 36px; }
    .how ul { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .modes { grid-template-columns: 1fr; gap: 14px; }
    .mode { padding: 18px; }
    .options { padding: 18px; }
    .seg { display: flex; width: 100%; }
    .seg label { flex: 1; text-align: center; }
    .seg span { padding: 8px 6px; }
    .row fieldset { width: 100%; }
    .go .btn { width: 100%; }
    .how ul { grid-template-columns: 1fr; }
  }
</style>
