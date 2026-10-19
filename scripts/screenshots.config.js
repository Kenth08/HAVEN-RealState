import { defineConfig, devices } from '@playwright/test';

// Separate from playwright.config.js so `npm run test:e2e` never rewrites the images.
export default defineConfig({
  testDir: '.',
  testMatch: 'screenshots.spec.js',
  reporter: 'list',
  use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4318', deviceScaleFactor: 1 },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4318 --strictPort',
    url: 'http://localhost:4318',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
