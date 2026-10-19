import { test, expect } from './fixtures';

const inView = (page, id) =>
  expect
    .poll(() => page.locator(`#${id}`).evaluate((el) => Math.abs(el.getBoundingClientRect().top)), { timeout: 5000 })
    .toBeLessThan(120);

test.describe('desktop header', () => {
  test.skip(({ isMobile }) => isMobile, 'the main nav is hidden on small screens');

  test('nav links scroll to their sections and keep an active search', async ({ page }) => {
    await page.goto('/?location=Austin%2C+TX');
    const nav = page.getByRole('navigation', { name: 'Main' });

    for (const [label, id] of [['Neighborhoods', 'neighborhoods'], ['Contact', 'contact'], ['Properties', 'discover']]) {
      await nav.getByRole('link', { name: label }).click();
      await inView(page, id);
      await expect(page).toHaveURL(new RegExp(`location=Austin.*#${id}$`));
    }
  });

  test('a direct link to a section lands on it', async ({ page }) => {
    await page.goto('/#contact');
    await inView(page, 'contact');
  });
});

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'the menu button only shows on small screens');

  test('opens with focus inside, closes on Escape and returns focus', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();

    const menu = page.getByRole('navigation', { name: 'Mobile' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Home' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  });

  test('a menu link closes the menu and scrolls to its section', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Contact' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeHidden();
    await inView(page, 'contact');
  });
});

test('no horizontal overflow on the home page', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
