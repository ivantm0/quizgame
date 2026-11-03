<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/state';
  import { Game } from '$lib/game.svelte';
  import { hash, paramsToConfig, streakMultiplier, type GameConfig } from '$lib/engine';
  import { history, type GameRecord } from '$lib/history.svelte';
  import { category, DIFFICULTIES, MODES } from '$lib/questions';
  import { formatNumber, isoDate, longDate } from '$lib/time';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import TimerRing from '$lib/components/TimerRing.svelte';
  import Results from '$lib/components/Results.svelte';

  const LETTERS = ['A', 'B', 'C', 'D'];

  let config = $state<GameConfig | null>(null);
  let game = $state<Game | null>(null);
  /** Reto de hoy ya jugado: se muestra su resultado en lugar de otra partida */
  let previous = $state<GameRecord | null>(null);
  let record = $state<GameRecord | null>(null);

  let heading = $state<HTMLElement>();
  let nextBtn = $state<HTMLButtonElement>();

  function newGame() {
    game?.destroy();
    record = null;
    const c = config!;
    const seed = c.daily ? hash(`quesabes-${c.daily}`) : Math.floor(Math.random() * 2 ** 32);
    game = new Game(c, seed, (r) => {
      history.add(r);
      record = r;
    });
  }

  onMount(() => {
    history.init();
    const today = isoDate();
    config = paramsToConfig(page.url.searchParams, today);
    const done = config.daily ? history.daily(config.daily) : undefined;
    if (done) previous = done;
    else newGame();
    return () => game?.destroy();
  });

  // Foco: el enunciado al cambiar de pregunta y «Siguiente» al responder
  $effect(() => {
    if (!game) return;
    const phase = game.phase;
    void game.index;
    void game.current;
    tick().then(() => {
      if (phase === 'question') heading?.focus({ preventScroll: true });
      if (phase === 'feedback' && nextBtn) {
        // En móvil la explicación queda bajo las respuestas: se desplaza hasta ella
        nextBtn.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        nextBtn.focus({ preventScroll: true });
      }
    });
  });

  function onKey(e: KeyboardEvent) {
    if (!game || e.metaKey || e.ctrlKey || e.altKey) return;
    if (game.phase === 'question') {
      const key = e.key.toUpperCase();
      const i = ['1', '2', '3', '4'].includes(key) ? Number(key) - 1 : LETTERS.indexOf(key);
      if (i >= 0) {
        e.preventDefault();
        game.answer(i);
      }
    } else if (game.phase === 'feedback' && (e.key === 'Enter' || e.key === 'ArrowRight')) {
      if (e.target instanceof HTMLButtonElement && e.target !== nextBtn) return;
      e.preventDefault();
      game.next();
    }
  }

  const title = $derived(
    !config ? 'Partida' : config.daily ? 'Reto diario' : config.mode === 'mix' ? 'Partida mixta' : MODES[config.mode].label,
  );
  const cat = $derived(game?.current ? category(game.current.question.category) : undefined);

  function optionState(i: number) {
    if (!game || game.phase === 'question') return game?.hidden.includes(i) ? 'hidden' : '';
    const last = game.last!;
    if (i === last.item.correct) return 'correct';
    if (i === last.choice) return 'wrong';
    return 'dim';
  }
</script>

<svelte:window onkeydown={onKey} />

<svelte:head>
  <title>{title} · QuéSabes</title>
</svelte:head>

<div class="container play" data-mode={config?.mode}>
  {#if previous}
    <Results record={previous} answers={null} heading="Ya has jugado el reto de hoy" sub="Vuelve mañana a por un reto nuevo. Este es tu resultado:" />
  {:else if game && record}
    <Results {record} answers={game.answers} onReplay={config?.daily ? undefined : newGame} />
  {:else if game && game.current}
    {@const item = game.current}
    {@const answered = game.phase === 'feedback'}
    <div class="top">
      <div class="top-info">
        <a href="/" class="exit" aria-label="Salir de la partida">✕</a>
        <div>
          <p class="eyebrow">{config?.daily ? `Reto diario · ${longDate(config.daily)}` : title}</p>
          <p class="count"><b>Pregunta {game.index + 1}</b> de {game.total}</p>
        </div>
      </div>
      <div class="top-stats">
        <div class="stat" aria-label="Puntuación">
          <span class="stat-label">Puntos</span>
          <b data-testid="score">{formatNumber(game.score)}</b>
        </div>
        <div class="stat streak" class:hot={game.streak >= 3} aria-label="Racha">
          <span class="stat-label">Racha</span>
          <b>🔥 {game.streak}{#if streakMultiplier(game.streak) > 1}<small>{` x${String(streakMultiplier(game.streak)).replace('.', ',')}`}</small>{/if}</b>
        </div>
        {#if config?.time}
          <TimerRing left={game.left} total={config.time * 1000} />
        {/if}
      </div>
    </div>

    <ol class="progress" aria-label="Progreso">
      {#each game.questions as _, i (i)}
        {@const a = game.answers[i]}
        <li class={a ? a.result : i === game.index ? 'now' : ''}>
          <span class="sr-only">Pregunta {i + 1}: {a ? (a.result === 'ok' ? 'acierto' : 'fallo') : i === game.index ? 'actual' : 'pendiente'}</span>
        </li>
      {/each}
    </ol>

    <article class="question card">
      <div class="tags">
        {#if cat}<span class="tag">{cat.emoji} {cat.label}</span>{/if}
        <span class="tag diff {item.question.difficulty}">{DIFFICULTIES[item.question.difficulty].label}</span>
      </div>
      <h1 bind:this={heading} tabindex="-1">{item.question.question}</h1>
      {#if item.question.code}<CodeBlock code={item.question.code} />{/if}

      <div class="options" role="group" aria-label="Respuestas">
        {#each item.options as option, i (item.question.id + i)}
          {@const st = optionState(i)}
          <button
            type="button"
            class="option {st}"
            disabled={answered || st === 'hidden'}
            aria-hidden={st === 'hidden' ? 'true' : undefined}
            onclick={() => game?.answer(i)}
          >
            <span class="letter" aria-hidden="true">{LETTERS[i]}</span>
            <span class="text">{option}</span>
            {#if st === 'correct'}<span class="mark" aria-label="Correcta">✓</span>{/if}
            {#if st === 'wrong'}<span class="mark" aria-label="Tu respuesta, incorrecta">✗</span>{/if}
          </button>
        {/each}
      </div>
    </article>

    {#if answered && game.last}
      {@const last = game.last}
      <section class="feedback card {last.result}" aria-live="polite">
        <div class="fb-head">
          <h2>
            {#if last.result === 'ok'}¡Correcto!{:else if last.result === 'time'}Se acabó el tiempo{:else}Incorrecto{/if}
          </h2>
          {#if last.points}<span class="gain">+{formatNumber(last.points)}</span>{/if}
        </div>
        <p>{last.item.question.explanation}</p>
        <button type="button" class="btn btn-primary" bind:this={nextBtn} onclick={() => game?.next()}>
          {game.index + 1 < game.total ? 'Siguiente pregunta' : 'Ver resultados'} <kbd>↵</kbd>
        </button>
      </section>
    {:else}
      <div class="lifelines">
        <button type="button" class="btn" onclick={() => game?.useFifty()} disabled={!game.fifty}>
          <span aria-hidden="true">🃏</span> 50:50
        </button>
        <button type="button" class="btn" onclick={() => game?.useSkip()} disabled={!game.canSkip}>
          <span aria-hidden="true">⏭️</span> Saltar pregunta
        </button>
        <p class="muted small keys">Responde con <kbd>1</kbd>–<kbd>4</kbd> o <kbd>A</kbd>–<kbd>D</kbd></p>
      </div>
    {/if}
  {:else if game}
    <div class="empty card">
      <h1>No hay preguntas con esos filtros</h1>
      <a class="btn btn-primary" href="/">Elegir otra partida</a>
    </div>
  {:else}
    <p class="loading muted">Preparando preguntas…</p>
  {/if}
</div>

<style>
  .play { max-width: 820px; padding: 28px 0 24px; }

  .top { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
  .top-info { display: flex; align-items: center; gap: 14px; min-width: 0; }
  .exit { display: grid; place-items: center; width: 40px; height: 40px; flex: none; border: 2px solid var(--ink); border-radius: 50%; background: var(--surface); text-decoration: none; font-weight: 700; }
  .exit:hover { background: var(--red-soft); }
  .count { font-size: 18px; }
  .top-stats { display: flex; align-items: center; gap: 18px; }
  .stat { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.15; }
  .stat-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
  .stat b { font-size: 22px; font-variant-numeric: tabular-nums; }
  .stat small { font-size: 14px; color: var(--accent); }
  .streak b { filter: grayscale(1); opacity: 0.6; transition: filter 0.2s, opacity 0.2s; }
  .streak.hot b { filter: none; opacity: 1; }

  .progress { list-style: none; display: flex; gap: 4px; margin: 0 0 18px; padding: 0; }
  .progress li { flex: 1; height: 8px; border-radius: 99px; background: var(--line); }
  .progress .now { background: var(--ink); }
  .progress .ok { background: var(--green); }
  .progress .ko, .progress .time { background: var(--red); }

  .question { padding: 26px; display: flex; flex-direction: column; gap: 18px; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag { padding: 3px 10px; border: 2px solid var(--ink); border-radius: 999px; font-size: 13px; font-weight: 700; background: var(--accent-soft); }
  .diff.facil { background: var(--green-soft); }
  .diff.media { background: #fff3c4; }
  .diff.dificil { background: var(--red-soft); }
  h1 { font-size: clamp(24px, 3.4vw, 34px); line-height: 1.15; outline: none; text-wrap: balance; }

  .options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .option {
    display: flex; align-items: center; gap: 12px; min-height: 64px; padding: 12px 14px; text-align: left;
    border: 2px solid var(--ink); border-radius: 14px; background: var(--surface); box-shadow: var(--shadow-sm);
    font-weight: 600; font-size: 17px; cursor: pointer; transition: transform 0.12s, box-shadow 0.12s, background 0.15s, opacity 0.2s;
  }
  .option:hover:not(:disabled) { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 var(--ink); background: var(--accent-soft); }
  .option:active:not(:disabled) { transform: translate(2px, 2px); box-shadow: none; }
  .option:disabled { cursor: default; }
  .letter { display: grid; place-items: center; width: 32px; height: 32px; flex: none; border: 2px solid var(--ink); border-radius: 9px; background: var(--bg); font-weight: 800; font-size: 15px; }
  .text { flex: 1; overflow-wrap: anywhere; }
  .mark { font-size: 22px; font-weight: 800; }
  .option.correct { background: var(--green-soft); border-color: var(--green); box-shadow: 2px 2px 0 var(--green); animation: pop 0.3s; }
  .option.correct .letter { background: var(--green); border-color: var(--green); color: #fff; }
  .option.correct .mark { color: var(--green); }
  .option.wrong { background: var(--red-soft); border-color: var(--red); box-shadow: 2px 2px 0 var(--red); animation: shake 0.35s; }
  .option.wrong .letter { background: var(--red); border-color: var(--red); color: #fff; }
  .option.wrong .mark { color: var(--red); }
  .option.dim { opacity: 0.45; }
  .option.hidden { visibility: hidden; }

  .feedback { margin-top: 18px; padding: 20px 22px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; animation: rise 0.25s ease-out; }
  .feedback.ok { background: var(--green-soft); }
  .feedback.ko, .feedback.time { background: var(--red-soft); }
  .fb-head { display: flex; align-items: center; gap: 12px; }
  .feedback h2 { font-size: 24px; }
  .gain { padding: 2px 10px; border: 2px solid var(--ink); border-radius: 999px; background: var(--yellow); font-weight: 800; }
  .feedback .btn { margin-top: 6px; }
  .feedback kbd { color: #fff; }

  .lifelines { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 18px; }
  .keys { margin-left: auto; }

  .empty { padding: 40px; display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
  .loading { padding: 80px 0; text-align: center; }

  @keyframes pop { 50% { transform: scale(1.03); } }
  @keyframes shake { 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
  @keyframes rise { from { opacity: 0; transform: translateY(8px); } }

  @media (max-width: 640px) {
    .play { padding-top: 16px; }
    .top { gap: 10px; }
    .top-info { gap: 10px; }
    .top-info .eyebrow { display: none; }
    .exit { width: 36px; height: 36px; }
    .count { font-size: 16px; line-height: 1.2; }
    .top-stats { gap: 12px; }
    .stat-label { font-size: 10px; }
    .stat b { font-size: 18px; }
    .top-stats :global(.ring) { width: 46px; height: 46px; }
    .question { padding: 18px; gap: 14px; }
    .options { grid-template-columns: 1fr; gap: 10px; }
    .option { min-height: 56px; font-size: 16px; }
    .keys { display: none; }
    .lifelines .btn { flex: 1; padding: 0 12px; }
  }
</style>
