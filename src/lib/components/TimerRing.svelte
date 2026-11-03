<script lang="ts">
  let { left, total }: { left: number; total: number } = $props();

  const R = 22;
  const C = 2 * Math.PI * R;
  const ratio = $derived(total ? left / total : 1);
  const seconds = $derived(Math.ceil(left / 1000));
  const urgent = $derived(ratio <= 0.3);
</script>

<div class="ring" class:urgent role="timer" aria-label="{seconds} segundos restantes">
  <svg viewBox="0 0 56 56" aria-hidden="true">
    <circle cx="28" cy="28" r={R} class="track" />
    <circle cx="28" cy="28" r={R} class="bar" stroke-dasharray={C} stroke-dashoffset={C * (1 - ratio)} />
  </svg>
  <span aria-hidden="true">{seconds}</span>
</div>

<style>
  .ring { position: relative; width: 56px; height: 56px; flex: none; }
  svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  circle { fill: none; stroke-width: 6; }
  .track { stroke: var(--line); }
  .bar { stroke: var(--accent); stroke-linecap: round; transition: stroke-dashoffset 0.1s linear, stroke 0.2s; }
  .urgent .bar { stroke: var(--red); }
  span { position: absolute; inset: 0; display: grid; place-items: center; font-weight: 800; font-size: 18px; font-variant-numeric: tabular-nums; }
  .urgent span { color: var(--red); animation: pulse 1s infinite; }
  @keyframes pulse { 50% { transform: scale(1.12); } }
</style>
