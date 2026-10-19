import { test as base, expect } from '@playwright/test';

/**
 * Shared setup for every test:
 * - skips the intro loader (it plays once per session) unless a test opts in;
 * - blocks the real Web3Forms endpoint so no test ever sends an email;
 * - fails the test on any uncaught page error or console error.
 */
export const test = base.extend({
  playIntro: [false, { option: true }],

  page: async ({ page, playIntro }, use) => {
    if (!playIntro) {
      await page.addInitScript(() => sessionStorage.setItem('haven:intro-seen', '1'));
    }
    await page.route('https://api.web3forms.com/**', (route) => route.abort());

    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      // Network failures a test provokes on purpose (mocked 500s, the blocked endpoint) are expected.
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) errors.push(message.text());
    });

    await use(page);
    expect(errors, 'console or page errors').toEqual([]);
  },
});

export { expect };

/** Answers the next inquiry with a Web3Forms-shaped response. */
export async function mockInquiry(page, { status = 200, success = true } = {}) {
  const requests = [];
  await page.route('https://api.web3forms.com/submit', async (route) => {
    requests.push(route.request().postDataBuffer()?.toString() ?? '');
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ success }) });
  });
  return requests;
}
