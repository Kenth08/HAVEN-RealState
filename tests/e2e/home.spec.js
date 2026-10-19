import { test, expect } from './fixtures';

test('home page loads with title, hero and every section', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/HAVEN/);
  for (const id of ['story', 'discover', 'neighborhoods', 'contact']) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.getByRole('contentinfo')).toContainText('portfolio');
});

test.describe('intro loader', () => {
  test.use({ playIntro: true });

  test('covers the page on a first visit, then lifts', async ({ page }) => {
    await page.goto('/');
    const loader = page.getByRole('status').filter({ hasText: 'Loading HAVEN' });
    await expect(loader).toBeVisible();
    await expect(loader).toBeHidden({ timeout: 6000 });
  });
});

test('skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: /skip to/i });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('unknown routes and unknown homes show the 404 page', async ({ page }) => {
  await page.goto('/no-such-page');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("This address doesn't exist.");

  await page.goto('/properties/no-such-home');
  await expect(page).toHaveTitle(/not found/i);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('legal pages render', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy Policy');
  await page.goto('/terms');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Terms');
});
