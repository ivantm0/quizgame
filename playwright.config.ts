import { defineConfig, devices } from '@playwright/test';

// Se prueba el build de producción. Con BASE_URL se prueba una web ya desplegada:
// BASE_URL=https://quizcardgame.netlify.app npx playwright test
const remote = process.env.BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: remote ?? 'http://localhost:5241', locale: 'es-ES', timezoneId: 'Europe/Madrid', acceptDownloads: true },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: remote
    ? undefined
    : {
        command: 'npm run build && npx vite preview --port 5241 --strictPort',
        url: 'http://localhost:5241',
        reuseExistingServer: false,
        timeout: 180_000,
      },
});
