import { expect, test, type Page } from '@playwright/test';
import { QUESTIONS } from '../src/lib/questions';

// Reloj fijo: sábado 31 de octubre de 2026
const TODAY = new Date('2026-10-31T10:00:00+01:00');

const heading = (page: Page) => page.locator('article.question h1');
const options = (page: Page) => page.locator('article.question .option');
const nextBtn = (page: Page) => page.getByRole('button', { name: /Siguiente pregunta|Ver resultados/ });

/** Busca en el banco la pregunta que se está mostrando y devuelve su respuesta correcta */
async function correctAnswer(page: Page) {
  const text = (await heading(page).textContent())!.trim();
  const code = page.locator('article.question pre');
  const snippet = (await code.count()) ? (await code.textContent())! : undefined;
  const q = QUESTIONS.find((x) => x.question === text && (x.code ?? undefined) === snippet);
  if (!q) throw new Error(`Pregunta no encontrada: ${text}`);
  return q.options[0];
}

async function answer(page: Page, right: boolean) {
  const correct = await correctAnswer(page);
  const button = right
    ? options(page).filter({ has: page.locator('.text').getByText(correct, { exact: true }) })
    : options(page).filter({ hasNot: page.locator('.text').getByText(correct, { exact: true }) }).first();
  await button.click();
}

async function playAll(page: Page, pattern: (i: number) => boolean) {
  const total = Number((await page.locator('.count').textContent())!.match(/de (\d+)/)![1]);
  for (let i = 0; i < total; i++) {
    await answer(page, pattern(i));
    await nextBtn(page).click();
  }
  return total;
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(TODAY);
});

test('la portada permite elegir modo, categoría y empezar', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('sabes');
  await expect(page.getByRole('radio', { name: /Modo dev/ })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByText('JavaScript', { exact: false }).first()).toBeVisible();

  await page.getByRole('radio', { name: /Cultura general/ }).click();
  await expect(page.locator('.chip', { hasText: 'Geografía' })).toBeVisible();
  await expect(page.locator('.chip', { hasText: 'TypeScript' })).toHaveCount(0);

  await page.locator('.chip', { hasText: 'Historia' }).click();
  await page.locator('.seg label', { hasText: '15' }).click();
  // Historia tiene 12 preguntas: la partida se ajusta
  await expect(page.getByText('la partida tendrá 12')).toBeVisible();
  await page.getByRole('button', { name: 'Empezar partida' }).click();

  await expect(page).toHaveURL(/modo=general&cat=hist/);
  await expect(page.locator('.count')).toHaveText('Pregunta 1 de 12');
  await expect(page.locator('.tag').first()).toContainText('Historia');
});

test('acertar suma puntos, enseña la explicación y alimenta la racha', async ({ page }) => {
  await page.goto('/jugar?modo=dev&cat=js&dif=facil&n=10&t=0');
  await answer(page, true);
  await expect(page.getByRole('heading', { name: '¡Correcto!' })).toBeVisible();
  // Fácil sin tiempo: 100 puntos
  await expect(page.getByTestId('score')).toHaveText('100');
  await expect(page.locator('.feedback p')).not.toBeEmpty();
  await nextBtn(page).click();

  await answer(page, true);
  await nextBtn(page).click();
  await answer(page, true);
  // Tercer acierto seguido: x1,5
  await expect(page.locator('.streak')).toContainText('3 x1,5');
  await expect(page.getByTestId('score')).toHaveText('350');
  await nextBtn(page).click();

  await answer(page, false);
  await expect(page.getByRole('heading', { name: 'Incorrecto' })).toBeVisible();
  await expect(page.locator('.option.wrong')).toHaveCount(1);
  await expect(page.locator('.option.correct')).toHaveCount(1);
  await expect(page.locator('.streak')).toContainText('0');
});

test('se juega con el teclado de principio a fin', async ({ page }) => {
  await page.goto('/jugar?modo=general&cat=geo&n=10&t=0');
  for (let i = 0; i < 10; i++) {
    await expect(page.locator('.count')).toHaveText(`Pregunta ${i + 1} de 10`);
    await page.keyboard.press(i % 2 ? 'b' : '1');
    await expect(page.locator('.feedback')).toBeVisible();
    await page.keyboard.press('Enter');
  }
  await expect(page.getByRole('heading', { name: 'Repaso' })).toBeVisible();
  await expect(page.locator('.review > li')).toHaveCount(10);
});

test('los comodines 50:50 y saltar se usan una vez', async ({ page }) => {
  await page.goto('/jugar?modo=dev&n=10&t=0');
  const fifty = page.getByRole('button', { name: '50:50' });
  await fifty.click();
  await expect(page.locator('.option.hidden')).toHaveCount(2);
  await expect(fifty).toBeDisabled();
  // La correcta nunca se oculta
  const correct = await correctAnswer(page);
  await expect(options(page).filter({ hasText: correct })).toBeVisible();

  const before = await heading(page).textContent();
  const code = await page.locator('article.question pre').count();
  const skip = page.getByRole('button', { name: 'Saltar pregunta' });
  await skip.click();
  await expect(skip).toBeDisabled();
  await expect(page.locator('.count')).toHaveText('Pregunta 1 de 10');
  await expect(page.locator('.option.hidden')).toHaveCount(0);
  // Cambia la pregunta (o, si el enunciado coincide, el fragmento de código)
  const after = await heading(page).textContent();
  if (after === before && code) await expect(page.locator('article.question pre')).toBeVisible();
  else expect(after).not.toBe(before);
});

test('si se acaba el tiempo la pregunta cuenta como fallo', async ({ page }) => {
  await page.clock.install({ time: TODAY });
  await page.goto('/jugar?modo=dev&n=10&t=10');
  await expect(page.getByRole('timer')).toHaveAccessibleName('10 segundos restantes');
  await page.clock.runFor(4_000);
  await expect(page.getByRole('timer')).toHaveAccessibleName('6 segundos restantes');
  await page.clock.runFor(7_000);
  await expect(page.getByRole('heading', { name: 'Se acabó el tiempo' })).toBeVisible();
  await expect(page.locator('.progress li').first()).toHaveClass(/time/);
});

test('al terminar se ven los resultados y se guardan en estadísticas', async ({ page }) => {
  await page.goto('/jugar?modo=dev&cat=ts&n=10&t=0');
  await playAll(page, (i) => i < 7);
  await expect(page.getByRole('heading', { name: /Muy bien/ })).toBeVisible();
  await expect(page.locator('.tiles')).toContainText('7/10');
  await expect(page.locator('.tiles')).toContainText('70 %');
  await expect(page.locator('.grid .ok')).toHaveCount(7);
  // Los fallos se abren en el repaso con la respuesta correcta
  await expect(page.locator('details[open]')).toHaveCount(3);

  await page.getByRole('link', { name: 'Estadísticas' }).click();
  await expect(page.locator('.tiles')).toContainText('1');
  await expect(page.locator('.tiles')).toContainText('70 %');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('Modo dev · TypeScript');
  await expect(page.locator('tbody')).toContainText('31/10/2026');

  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Borrar historial' }).click();
  await expect(page.getByText('Aún no has jugado ninguna partida')).toBeVisible();
});

test('el reto diario es igual para todos y solo se juega una vez', async ({ page, browser }) => {
  await page.goto('/jugar?reto');
  await expect(page.locator('.eyebrow').first()).toContainText('sábado 31 de octubre');
  const first = await heading(page).textContent();

  // Otro navegador ve la misma primera pregunta
  const other = await browser.newContext({ locale: 'es-ES', timezoneId: 'Europe/Madrid' });
  const page2 = await other.newPage();
  await page2.clock.setFixedTime(TODAY);
  await page2.goto('/jugar?reto');
  await expect(heading(page2)).toHaveText(first!);
  await other.close();

  await playAll(page, (i) => i % 2 === 0);
  await expect(page.getByRole('button', { name: 'Jugar otra vez' })).toHaveCount(0);

  await page.goto('/jugar?reto');
  await expect(page.getByRole('heading', { name: /Ya has jugado el reto de hoy/ })).toBeVisible();
  await page.goto('/');
  await expect(page.locator('.daily')).toContainText('Ya has jugado hoy');
  await expect(page.locator('.daily')).toContainText('5/10');
});

test('compartir copia el resultado con la cuadrícula', async ({ page, context, isMobile }) => {
  test.skip(isMobile, 'En móvil se usa el menú nativo de compartir');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/jugar?reto');
  await playAll(page, (i) => i < 3);
  await page.getByRole('button', { name: 'Compartir resultado' }).click();
  await expect(page.getByRole('status')).toHaveText('Resultado copiado al portapapeles');
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain('QuéSabes · Reto del 31/10/2026');
  expect(text).toContain('🟩🟩🟩🟥🟥🟥🟥🟥🟥🟥');
  expect(text).toContain('3/10');
});

test('una ruta inexistente muestra la página de error', async ({ page }) => {
  await page.goto('/no-existe');
  await expect(page.getByRole('heading', { name: 'Esta pregunta no tiene respuesta' })).toBeVisible();
});
