import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    // Web estática: las pantallas se pre-renderizan y el juego funciona en el navegador
    adapter: adapter({ fallback: '404.html' }),
    prerender: { handleHttpError: 'fail' },
  },
};
