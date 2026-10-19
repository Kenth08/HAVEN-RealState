import { test, expect } from './fixtures';

const filters = (page) => page.getByRole('search', { name: 'Filter homes' });
const cards = (page) => page.locator('#discover article');
const resultCount = (page) => page.locator('#discover').getByText(/\d+ homes? (match your search|in the collection)/);

test('filtering by location updates results and the URL, and survives a reload', async ({ page }) => {
  await page.goto('/#discover');
  await filters(page).getByLabel('Location').selectOption('Austin, TX');
  await filters(page).getByRole('button', { name: 'Search' }).click();

  await expect(page).toHaveURL(/location=Austin/);
  await expect(resultCount(page)).toHaveText('2 homes match your search');
  await expect(cards(page)).toHaveCount(2);

  await page.reload();
  await expect(resultCount(page)).toHaveText('2 homes match your search');
  await expect(filters(page).getByLabel('Location')).toHaveValue('Austin, TX');
});

test('a minimum above the maximum is swapped', async ({ page }) => {
  await page.goto('/#discover');
  await filters(page).getByLabel('Min price').selectOption('5000000');
  await filters(page).getByLabel('Max price').selectOption('1000000');
  await filters(page).getByRole('button', { name: 'Search' }).click();
  await expect(page).toHaveURL(/min=1000000&max=5000000/);
});

test('an impossible search shows the empty state, and Clear filters resets it', async ({ page }) => {
  await page.goto('/?type=Cabin&beds=5#discover');
  await expect(page.getByText('No homes match those filters.')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(resultCount(page)).toContainText('in the collection');
  await expect(page).not.toHaveURL(/type=/);
});

test('sorting by price orders the cards from low to high', async ({ page }) => {
  await page.goto('/#discover');
  await page.locator('#discover').getByRole('combobox').last().selectOption('price-asc');
  await expect(page).toHaveURL(/sort=price-asc/);
  await expect(cards(page).first()).toContainText('Linden Row');
});

test('a card opens its property page, and back returns to the search', async ({ page }) => {
  await page.goto('/?location=Malibu%2C+CA#discover');
  await cards(page).first().getByRole('link').click();

  await expect(page).toHaveURL(/\/properties\/saltwater-villa$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Saltwater Villa' })).toBeVisible();
  await expect(page).toHaveTitle(/Saltwater Villa/);

  await page.goBack();
  await expect(page).toHaveURL(/location=Malibu/);
});
