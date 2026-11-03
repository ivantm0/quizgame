# QuéSabes

Juego de preguntas en español con dos modos: **dev** (HTML, CSS, JavaScript, TypeScript, accesibilidad, Git y web, con fragmentos de código) y **cultura general** (geografía, historia, ciencia, arte, cine y música, deportes).

Proyecto de portfolio de [Iván Terol](https://ivanterol.com), hecho con SvelteKit y Svelte 5. **Demo:** https://quizcardgame.netlify.app

## Qué incluye

- **144 preguntas propias** en tres dificultades, cada una con su explicación. Viven en el repo (`src/lib/questions`), sin depender de ninguna API.
- **Partidas configurables**: modo, categoría, dificultad, número de preguntas y tiempo por pregunta. La configuración va en la URL, así que una partida se puede compartir.
- **Puntuación con rapidez y rachas**: puntos según la dificultad, hasta 50 más por responder rápido, y x1,5 o x2 por aciertos seguidos.
- **Comodines**: 50:50 y saltar pregunta, una vez por partida.
- **Reto diario**: 10 preguntas iguales para todo el mundo (aleatoriedad con semilla por fecha), un intento al día y racha de días.
- **Resultados**: repaso pregunta a pregunta, aciertos por categoría y texto para compartir con cuadrícula de emojis.
- **Estadísticas** guardadas en el navegador: precisión por categoría, récords y últimas partidas.
- **Accesible**: se juega entero con teclado (1–4 / A–D y Enter), gestiona el foco, anuncia los cambios y respeta `prefers-reduced-motion`.
- El código de las preguntas se resalta troceándolo en texto, nunca insertando HTML.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5240
npm run check      # tipos y Svelte
npm run test:e2e   # Playwright sobre el build de producción (escritorio y móvil)
BASE_URL=https://quizcardgame.netlify.app npx playwright test   # los mismos tests contra la web publicada
```

La web es estática (`adapter-static`) y se despliega en Netlify con `netlify.toml`.

## Estructura

```
src/lib/questions/   bancos de preguntas y categorías
src/lib/engine.ts    selección con semilla, puntuación y configuración en la URL
src/lib/game.svelte.ts     estado de una partida (temporizador, comodines, rachas)
src/lib/history.svelte.ts  historial y estadísticas en localStorage
src/routes/          portada, /jugar y /estadisticas
e2e/                 tests de Playwright
```
