<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { history } from '$lib/history.svelte';
  import Logo from '$lib/components/Logo.svelte';

  let { children } = $props();
  // La query de la URL no existe al pre-renderizar: se mira solo en el navegador
  let mounted = $state(false);

  onMount(() => {
    history.init();
    mounted = true;
  });

  const links = [
    { href: '/', label: 'Jugar' },
    { href: '/jugar?reto', label: 'Reto diario' },
    { href: '/estadisticas', label: 'Estadísticas' },
  ];

  function current(href: string) {
    const [path, query] = href.split('?');
    if (page.url.pathname !== path) return false;
    return path !== '/jugar' || (mounted && page.url.searchParams.has(query));
  }
</script>

<a class="skip" href="#main">Saltar al contenido</a>

<header>
  <div class="container bar">
    <a href="/" class="brand" aria-label="QuéSabes, inicio">
      <Logo />
      <span>Qué<b>Sabes</b></span>
    </a>
    <nav aria-label="Principal">
      {#each links as l (l.href)}
        <a href={l.href} aria-current={current(l.href) ? 'page' : undefined}>{l.label}</a>
      {/each}
    </nav>
  </div>
</header>

<main id="main" tabindex="-1">
  {@render children()}
</main>

<footer class="container">
  <p class="muted small">
    QuéSabes es un proyecto de portfolio de <a href="https://ivanterol.com" rel="noopener">Iván Terol</a>. Preguntas
    escritas para el proyecto; tus partidas solo se guardan en este navegador.
  </p>
</footer>

<style>
  .skip { position: fixed; left: 16px; top: -60px; z-index: 100; padding: 10px 16px; border: 2px solid var(--ink); border-radius: 12px; background: var(--yellow); font-weight: 700; }
  .skip:focus { top: 12px; }

  header { position: sticky; top: 0; z-index: 30; background: rgb(251 246 236 / 0.88); backdrop-filter: blur(10px); border-bottom: 2px solid var(--ink); }
  .bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 68px; }
  .brand { display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 600; letter-spacing: -0.02em; text-decoration: none; }
  .brand b { font-weight: 800; color: var(--violet); }

  nav { display: flex; gap: 4px; }
  nav a { padding: 8px 14px; border: 2px solid transparent; border-radius: 999px; font-weight: 600; font-size: 15px; text-decoration: none; white-space: nowrap; }
  nav a:hover { border-color: var(--ink); }
  nav a[aria-current='page'] { background: var(--ink); color: var(--bg); }

  main { outline: none; min-height: calc(100dvh - 68px - 90px); }
  footer { padding: 32px 0 40px; text-align: center; }

  @media (max-width: 640px) {
    .bar { height: auto; padding: 12px 0; flex-direction: column; gap: 8px; }
    nav a { padding: 6px 12px; font-size: 14px; }
  }
</style>
