const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const pages = [
  'index.html',
  'prestations.html',
  'apropos.html',
  'avis.html',
  'devis.html',
  'contact.html',
  'mentions-legales.html',
  'confidentialite.html'
];

async function installOpenSpy(page) {
  await page.addInitScript(() => {
    window.__openedUrls = [];
    window.open = (url) => {
      window.__openedUrls.push(String(url));
      return null;
    };
  });
}

async function openedUrl(page) {
  return page.evaluate(() => window.__openedUrls?.at(-1) || '');
}

function assertNoBrowserErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

test.describe('Essential public site checks', () => {
  for (const currentPage of pages) {
    test(`loads ${currentPage} without browser errors`, async ({ page }) => {
      const errors = assertNoBrowserErrors(page);
      const response = await page.goto(`${BASE_URL}/${currentPage}`);
      expect(response?.ok(), `${currentPage} should return HTTP 200`).toBeTruthy();
      await expect(page.locator('header.site-header')).toBeVisible();
      await expect(page.locator('footer.site-footer')).toBeVisible();
      await expect(page.locator('body')).toContainText('Leticia');
      expect(errors, `Browser errors on ${currentPage}`).toEqual([]);
    });
  }

  test('desktop navigation reaches every main page', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`);
    const navTargets = [
      ['Prestations', /prestations\.html$/],
      ['À propos', /apropos\.html$/],
      ['Avis', /avis\.html$/],
      ['Contact', /contact\.html$/],
      ['Recevoir une estimation', /devis\.html$/]
    ];

    for (const [label, expectedUrl] of navTargets) {
      await page.goto(`${BASE_URL}/index.html`);
      await page.getByRole('navigation').getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(expectedUrl);
    }
  });

  test('mobile menu opens, closes and keeps navigation usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/index.html`);

    const toggle = page.locator('.nav-toggle');
    const nav = page.locator('#main-nav');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toHaveClass(/open/);

    await nav.getByRole('link', { name: 'Prestations' }).click();
    await expect(page).toHaveURL(/prestations\.html$/);
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  });

  test('service cards prefill the quote form correctly', async ({ page }) => {
    const services = [
      ['menage-regulier', 'Ménage régulier'],
      ['menage-ponctuel', 'Ménage ponctuel'],
      ['repassage', 'Repassage'],
      ['grand-nettoyage', 'Grand nettoyage']
    ];

    for (const [key, label] of services) {
      await page.goto(`${BASE_URL}/devis.html?service=${key}`);
      await expect(page.locator('#service')).toHaveValue(label);
    }
  });

  test('quote form validates required fields and prepares a WhatsApp message', async ({ page }) => {
    await installOpenSpy(page);
    await page.goto(`${BASE_URL}/devis.html?service=menage-regulier`);

    await page.getByRole('button', { name: /Envoyer ma demande/i }).click();
    await expect.poll(() => openedUrl(page)).toBe('');

    await page.locator('#firstname').fill('Sophie');
    await page.locator('#phone').fill('0612345678');
    await page.locator('#email').fill('sophie@example.com');
    await page.locator('#zone').selectOption({ label: 'Bordeaux Centre' });
    await page.locator('#housing').selectOption({ label: 'Appartement T2' });
    await page.locator('#surface').selectOption({ label: '30 à 50 m²' });
    await page.locator('#frequency').selectOption({ label: 'Chaque semaine' });
    await page.locator('#message').fill('Priorité cuisine et salle de bain.');
    await page.getByRole('button', { name: /Envoyer ma demande/i }).click();

    const url = await openedUrl(page);
    expect(url).toContain('https://wa.me/33768345608?text=');
    const text = decodeURIComponent(new URL(url).searchParams.get('text') || '');
    expect(text).toContain('Bonjour, je souhaite une première estimation');
    expect(text).toContain('Prénom : Sophie');
    expect(text).toContain('Ville/quartier : Bordeaux Centre');
    expect(text).toContain('Besoin principal : Ménage régulier');
    expect(text).toContain('Fréquence souhaitée : Chaque semaine');
  });

  test('quote form handles Autre city workflow', async ({ page }) => {
    await installOpenSpy(page);
    await page.goto(`${BASE_URL}/devis.html`);

    await page.locator('#zone').selectOption({ label: 'Autre' });
    await expect(page.locator('#other-zone-row')).not.toHaveClass(/hidden/);
    await expect(page.locator('#other-zone')).toHaveJSProperty('required', true);

    await page.locator('#firstname').fill('Marc');
    await page.locator('#phone').fill('0600000000');
    await page.locator('#other-zone').fill('Cenon');
    await page.locator('#housing').selectOption({ label: 'Maison' });
    await page.locator('#surface').selectOption({ label: '80 à 120 m²' });
    await page.locator('#service').selectOption({ label: 'Grand nettoyage' });
    await page.locator('#frequency').selectOption({ label: 'Une seule fois' });
    await page.getByRole('button', { name: /Envoyer ma demande/i }).click();

    const text = decodeURIComponent(new URL(await openedUrl(page)).searchParams.get('text') || '');
    expect(text).toContain('Ville/quartier : Cenon');
    expect(text).toContain('Besoin principal : Grand nettoyage');
  });

  test('review form validates and prepares WhatsApp review message', async ({ page }) => {
    await installOpenSpy(page);
    await page.goto(`${BASE_URL}/avis.html`);

    await page.getByRole('button', { name: /Préparer mon avis/i }).click();
    await expect.poll(() => openedUrl(page)).toBe('');

    await page.locator('#review-name').fill('Claire');
    await page.locator('#review-city').fill('Talence');
    await page.locator('#review-rating').selectOption({ label: '5/5' });
    await page.locator('#review-service').selectOption({ label: 'Ménage régulier' });
    await page.locator('#review-message').fill('Travail très soigné et communication facile.');
    await page.getByRole('button', { name: /Préparer mon avis/i }).click();

    const url = await openedUrl(page);
    expect(url).toContain('https://wa.me/33768345608?text=');
    const text = decodeURIComponent(new URL(url).searchParams.get('text') || '');
    expect(text).toContain('Bonjour, je souhaite laisser un avis');
    expect(text).toContain('Prénom : Claire');
    expect(text).toContain('Ville/quartier : Talence');
    expect(text).toContain('Note : 5/5');
    expect(text).toContain('Avis : Travail très soigné et communication facile.');
  });

  test('contact WhatsApp CTA points to the expected number', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact.html`);
    await expect(page.getByRole('link', { name: /Écrire sur WhatsApp/i })).toHaveAttribute('href', 'https://wa.me/33768345608');
  });
});
