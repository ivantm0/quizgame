<script lang="ts">
  import { onMount } from 'svelte';
  import { history } from '$lib/history.svelte';
  import { categoriesOf, category, DIFFICULTIES, MODES, type Mode } from '$lib/questions';
  import { formatNumber, formatSeconds, isoDate, shortDate } from '$lib/time';

  let today = $state('');
  onMount(() => {
    history.init();
    today = isoDate();
  });

  const stats = $derived(history.stats);
  const streak = $derived(today ? history.dailyStreak(today) : 0);
  const recent = $derived(history.games.slice(0, 10));

  function name(g: (typeof history.games)[number]) {
    if (g.daily) return `Reto del ${shortDate(g.daily)}`;
    const mode = g.mode === 'mix' ? 'Mixta' : MODES[g.mode].label;
    return g.category === 'all' ? mode : `${mode} · ${category(g.category)?.label ?? g.category}`;
  }

  function reset() {
    if (confirm('¿Borrar todo tu historial de partidas? No se puede deshacer.')) history.clear();
  }
</script>

<svelte:head>
  <title>Estadísticas · QuéSabes</title>
</svelte:head>

<div class="container stats">
  <header class="head">
    <div>
      <p class="eyebrow">Tu progreso</p>
      <h1>Estadísticas</h1>
    </div>
    {#if stats.played}
      <button type="button" class="btn" onclick={reset}>Borrar historial</button>
    {/if}
  </header>

  {#if !history.ready}
    <p class="muted">Cargando…</p>
  {:else if !stats.played}
    <div class="empty card">
      <span class="big" aria-hidden="true">📊</span>
      <h2>Aún no has jugado ninguna partida</h2>
      <p class="muted">Cuando termines una partida verás aquí tu precisión, tus récords y en qué categorías flojeas.</p>
      <a class="btn btn-primary" href="/">Jugar ahora</a>
    </div>
  {:else}
    <dl class="tiles">
      <div class="card"><dt>Partidas</dt><dd>{stats.played}</dd></div>
      <div class="card"><dt>Precisión</dt><dd>{Math.round(stats.accuracy * 100)} %</dd></div>
      <div class="card"><dt>Récord</dt><dd>{formatNumber(stats.bestScore)}</dd></div>
      <div class="card"><dt>Mejor racha</dt><dd>🔥 {stats.bestStreak}</dd></div>
      <div class="card"><dt>Tiempo medio</dt><dd>{formatSeconds(stats.avgMs)}</dd></div>
      <div class="card"><dt>Racha de retos</dt><dd>{streak} {streak === 1 ? 'día' : 'días'}</dd></div>
    </dl>

    <div class="cols">
      {#each Object.keys(MODES) as m (m)}
        {@const mode = m as Mode}
        <section class="card block" data-mode={mode} aria-labelledby="mode-{mode}">
          <h2 id="mode-{mode}">{MODES[mode].emoji} {MODES[mode].label}</h2>
          <ul class="bars">
            {#each categoriesOf(mode) as c (c.id)}
              {@const s = stats.byCategory[c.id]}
              <li>
                <span class="bar-label">{c.emoji} {c.label}</span>
                <span class="bar" role="img" aria-label={s ? `${Math.round((s[0] / s[1]) * 100)} % de aciertos` : 'Sin datos'}>
                  <span style:width="{s ? (s[0] / s[1]) * 100 : 0}%"></span>
                </span>
                <span class="bar-value">{s ? `${s[0]}/${s[1]}` : '—'}</span>
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    </div>

    <section class="card block" aria-labelledby="recent-title">
      <h2 id="recent-title">Últimas partidas</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th scope="col">Partida</th><th scope="col">Dificultad</th><th scope="col">Aciertos</th><th scope="col">Puntos</th><th scope="col">Fecha</th></tr>
          </thead>
          <tbody>
            {#each recent as g (g.id)}
              <tr>
                <td>{name(g)}</td>
                <td>{g.difficulty === 'mixta' ? 'Mixta' : DIFFICULTIES[g.difficulty].label}</td>
                <td>{g.correct}/{g.total}</td>
                <td><b>{formatNumber(g.score)}</b></td>
                <td class="muted">{shortDate(isoDate(new Date(g.at)))}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  {/if}
</div>

<style>
  .stats { padding: 44px 0 24px; display: flex; flex-direction: column; gap: 22px; }
  .head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  h1 { font-size: clamp(40px, 6vw, 64px); }

  .empty { padding: 40px; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
  .big { font-size: 48px; }
  .empty h2 { font-size: 28px; }

  .tiles { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; margin: 0; }
  .tiles div { padding: 16px; box-shadow: var(--shadow-sm); }
  dt { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
  dd { margin: 4px 0 0; font-size: 28px; font-weight: 800; font-variant-numeric: tabular-nums; white-space: nowrap; }

  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .block { padding: 24px; }
  .block h2 { font-size: 24px; margin-bottom: 16px; }
  .bars { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
  .bars li { display: grid; grid-template-columns: 150px 1fr 52px; align-items: center; gap: 12px; font-weight: 600; font-size: 15px; }
  .bar { height: 14px; border: 2px solid var(--ink); border-radius: 99px; background: var(--bg); overflow: hidden; }
  .bar span { display: block; height: 100%; background: var(--accent); }
  .bar-value { text-align: right; font-variant-numeric: tabular-nums; }

  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 15px; }
  th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); padding: 0 12px 10px 0; }
  td { padding: 12px 12px 12px 0; border-top: 2px dashed var(--line); white-space: nowrap; }

  @media (max-width: 900px) {
    .tiles { grid-template-columns: repeat(3, 1fr); }
    .cols { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .stats { padding-top: 28px; }
    .tiles { grid-template-columns: 1fr 1fr; }
    dd { font-size: 24px; }
    .block { padding: 18px; }
    .bars li { grid-template-columns: 1fr 52px; }
    .bar { grid-column: 1 / -1; grid-row: 2; }
  }
</style>
