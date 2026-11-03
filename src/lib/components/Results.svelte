<script lang="ts">
  import { onMount } from 'svelte';
  import type { Answer } from '$lib/game.svelte';
  import type { GameRecord } from '$lib/history.svelte';
  import { category, MODES } from '$lib/questions';
  import { share, shareText } from '$lib/share';
  import { formatNumber, formatSeconds } from '$lib/time';
  import CodeBlock from './CodeBlock.svelte';

  let {
    record,
    answers,
    heading,
    sub,
    onReplay,
  }: { record: GameRecord; answers: Answer[] | null; heading?: string; sub?: string; onReplay?: () => void } = $props();

  const accuracy = $derived(record.total ? record.correct / record.total : 0);
  const verdict = $derived(
    accuracy >= 0.9 ? '¡Matrícula de honor!' : accuracy >= 0.7 ? '¡Muy bien!' : accuracy >= 0.5 ? 'Aprobado' : 'A repasar',
  );
  const emoji = $derived(accuracy >= 0.9 ? '🏆' : accuracy >= 0.7 ? '🎉' : accuracy >= 0.5 ? '👍' : '📚');
  const categories = $derived(
    Object.entries(record.byCategory)
      .map(([id, [c, t]]) => ({ id, c, t, info: category(id) }))
      .sort((a, b) => b.c / b.t - a.c / a.t),
  );
  const label = $derived(record.daily ? 'Reto diario' : record.mode === 'mix' ? 'Partida mixta' : MODES[record.mode].label);

  // El marcador sube desde 0 al mostrarse
  let shown = $state(0);
  onMount(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return void (shown = record.score);
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const p = Math.min(1, (now - start) / 900);
      shown = Math.round(record.score * (1 - (1 - p) ** 3));
      if (p < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  });

  let shareMsg = $state('');
  async function onShare() {
    const res = await share(shareText(record));
    shareMsg = res === 'copied' ? 'Resultado copiado al portapapeles' : res === 'shared' ? '¡Compartido!' : 'No se ha podido compartir';
    setTimeout(() => (shareMsg = ''), 2500);
  }

  const LETTERS = ['A', 'B', 'C', 'D'];
</script>

<section class="results" aria-labelledby="res-title">
  <div class="summary card">
    <p class="eyebrow">{label}</p>
    <h1 id="res-title"><span aria-hidden="true">{emoji}</span> {heading ?? verdict}</h1>
    {#if sub}<p class="muted">{sub}</p>{/if}

    <p class="score" aria-label="{formatNumber(record.score)} puntos">
      <b data-testid="final-score">{formatNumber(shown)}</b> <span>puntos</span>
    </p>

    <ul class="grid" aria-label="Resultado por pregunta">
      {#each record.results as r, i (i)}
        <li class={r} title="Pregunta {i + 1}"><span class="sr-only">{r === 'ok' ? 'Acierto' : r === 'time' ? 'Sin tiempo' : 'Fallo'}</span></li>
      {/each}
    </ul>

    <dl class="tiles">
      <div><dt>Aciertos</dt><dd>{record.correct}/{record.total}</dd></div>
      <div><dt>Precisión</dt><dd>{Math.round(accuracy * 100)} %</dd></div>
      <div><dt>Tiempo medio</dt><dd>{formatSeconds(record.avgMs)}</dd></div>
      <div><dt>Mejor racha</dt><dd>🔥 {record.bestStreak}</dd></div>
    </dl>

    <div class="actions">
      {#if onReplay}
        <button type="button" class="btn btn-primary btn-lg" onclick={onReplay}>Jugar otra vez</button>
      {/if}
      <button type="button" class="btn btn-yellow btn-lg" onclick={onShare}>Compartir resultado</button>
      <a class="btn btn-lg" href="/">{onReplay ? 'Cambiar partida' : 'Volver al inicio'}</a>
    </div>
    <p class="share-msg small" role="status">{shareMsg}</p>
  </div>

  {#if categories.length > 1}
    <section class="card block" aria-labelledby="cat-title">
      <h2 id="cat-title">Por categoría</h2>
      <ul class="bars">
        {#each categories as c (c.id)}
          <li>
            <span class="bar-label">{c.info?.emoji} {c.info?.label ?? c.id}</span>
            <span class="bar"><span style:width="{(c.c / c.t) * 100}%"></span></span>
            <span class="bar-value">{c.c}/{c.t}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if answers}
    <section class="block" aria-labelledby="review-title">
      <h2 id="review-title">Repaso</h2>
      <ol class="review">
        {#each answers as a, i (i)}
          {@const q = a.item.question}
          <li>
            <details class="card {a.result}" open={a.result !== 'ok'}>
              <summary>
                <span class="badge" aria-label={a.result === 'ok' ? 'Acierto' : 'Fallo'}>{a.result === 'ok' ? '✓' : '✗'}</span>
                <span class="q">{i + 1}. {q.question}</span>
                <span class="pts">{a.points ? `+${formatNumber(a.points)}` : '0'}</span>
              </summary>
              <div class="detail">
                {#if q.code}<CodeBlock code={q.code} />{/if}
                <p>
                  <b>Respuesta correcta:</b> {LETTERS[a.item.correct]}. {a.item.options[a.item.correct]}
                </p>
                {#if a.result === 'ko' && a.choice !== null}
                  <p><b>Tu respuesta:</b> {LETTERS[a.choice]}. {a.item.options[a.choice]}</p>
                {:else if a.result === 'time'}
                  <p><b>Sin respuesta:</b> se acabó el tiempo.</p>
                {/if}
                <p class="muted">{q.explanation}</p>
              </div>
            </details>
          </li>
        {/each}
      </ol>
    </section>
  {/if}
</section>

<style>
  .results { display: flex; flex-direction: column; gap: 22px; }
  .summary { padding: 30px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
  h1 { font-size: clamp(32px, 5vw, 48px); }
  .score { display: flex; align-items: baseline; gap: 10px; margin-top: 4px; }
  .score b { font-size: clamp(56px, 10vw, 88px); line-height: 1; letter-spacing: -0.04em; color: var(--accent); font-variant-numeric: tabular-nums; }
  .score span { font-weight: 700; color: var(--muted); }

  .grid { list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin: 4px 0; padding: 0; }
  .grid li { width: 26px; height: 26px; border: 2px solid var(--ink); border-radius: 7px; }
  .grid .ok { background: var(--green); }
  .grid .ko { background: var(--red); }
  .grid .time { background: var(--ink); }

  .tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; margin: 10px 0 0; }
  .tiles div { padding: 12px; border: 2px solid var(--ink); border-radius: 14px; background: var(--bg); }
  dt { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
  dd { margin: 2px 0 0; font-size: 24px; font-weight: 800; font-variant-numeric: tabular-nums; }

  .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 12px; }
  .share-msg { min-height: 1.5em; font-weight: 600; color: var(--green); }

  .block h2 { font-size: 26px; margin-bottom: 14px; }
  section.card.block { padding: 24px; }
  .bars { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .bars li { display: grid; grid-template-columns: 180px 1fr 48px; align-items: center; gap: 12px; font-weight: 600; }
  .bar { height: 14px; border: 2px solid var(--ink); border-radius: 99px; background: var(--bg); overflow: hidden; }
  .bar span { display: block; height: 100%; background: var(--accent); }
  .bar-value { text-align: right; font-variant-numeric: tabular-nums; }

  .review { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  details { box-shadow: var(--shadow-sm); }
  summary { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; list-style: none; font-weight: 600; }
  summary::-webkit-details-marker { display: none; }
  .badge { display: grid; place-items: center; width: 28px; height: 28px; flex: none; border-radius: 50%; color: #fff; font-weight: 800; }
  .ok .badge { background: var(--green); }
  .ko .badge, .time .badge { background: var(--red); }
  .q { flex: 1; }
  .pts { font-weight: 800; color: var(--muted); font-variant-numeric: tabular-nums; }
  .detail { display: flex; flex-direction: column; gap: 8px; padding: 0 16px 16px 56px; }

  @media (max-width: 640px) {
    .summary { padding: 22px 16px; }
    .tiles { grid-template-columns: 1fr 1fr; }
    .actions .btn { width: 100%; }
    .bars li { grid-template-columns: 1fr 48px; }
    .bar { grid-column: 1 / -1; grid-row: 2; }
    .detail { padding-left: 16px; }
  }
</style>
