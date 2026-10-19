// Regenerates the README screenshots in docs/screenshots:
//   npx playwright test --config scripts/screenshots.config.js
import { test } from '@playwright/test';

const OUT = 'docs/screenshots';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('haven:intro-seen', '1'));
});

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // let entrance animations finish
}

test('desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('/');
  await settle(page);
  await page.screenshot({ path: `${OUT}/home.jpg`, quality: 82 });

  await page.goto('/#discover');
  await settle(page);
  await page.screenshot({ path: `${OUT}/search.jpg`, quality: 82 });

  await page.goto('/properties/saltwater-villa');
  await settle(page);
  await page.screenshot({ path: `${OUT}/property.jpg`, quality: 82 });
});

test('mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await settle(page);
  await page.screenshot({ path: `${OUT}/mobile.jpg`, quality: 82 });
});
