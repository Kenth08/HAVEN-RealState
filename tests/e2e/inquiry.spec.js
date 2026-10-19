import { test, expect, mockInquiry } from './fixtures';

const contactForm = (page) => page.locator('#contact form');

test('invalid fields show errors and focus the first one', async ({ page }) => {
  await page.goto('/#contact');
  await contactForm(page).getByRole('button', { name: 'Send inquiry' }).click();

  await expect(contactForm(page).getByLabel('Name')).toBeFocused();
  await expect(contactForm(page).getByText('Please tell us your name.')).toBeVisible();
  await expect(contactForm(page).getByText('Please enter a valid email address.')).toBeVisible();
});

test('a valid inquiry is sent and confirmed', async ({ page }) => {
  const requests = await mockInquiry(page);
  await page.goto('/#contact');
  const form = contactForm(page);
  await form.getByLabel('Name').fill('ada lovelace');
  await form.getByLabel('Email').fill('ada@example.com');
  await form.getByText('Sell', { exact: true }).click();
  await form.getByLabel('Message').fill('I would like to sell my townhouse this spring.');
  await form.getByRole('button', { name: 'Send inquiry' }).click();

  await expect(page.getByText('Thank you, Ada.')).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(requests[0]).toContain('ada@example.com');
  expect(requests[0]).toContain('Sell');
});

test('a failed send keeps the text and offers email instead', async ({ page }) => {
  await mockInquiry(page, { status: 500, success: false });
  await page.goto('/#contact');
  const form = contactForm(page);
  await form.getByLabel('Name').fill('Ada');
  await form.getByLabel('Email').fill('ada@example.com');
  await form.getByLabel('Message').fill('Looking for a cabin near the mountains.');
  await form.getByRole('button', { name: 'Send inquiry' }).click();

  await expect(form.getByText('Your message couldn’t be sent.')).toBeVisible();
  await expect(form.getByRole('link', { name: /Or email/ })).toBeVisible();
  await expect(form.getByLabel('Message')).toHaveValue('Looking for a cabin near the mountains.');
});

test('the viewing form on a property page is pre-filled and names the home', async ({ page }) => {
  const requests = await mockInquiry(page);
  await page.goto('/properties/arden-house');
  const form = page.locator('form').filter({ has: page.getByLabel('Message') });
  await expect(form.getByLabel('Message')).toHaveValue(/Arden House in Hudson Valley, NY/);

  await form.getByLabel('Name').fill('Grace');
  await form.getByLabel('Email').fill('grace@example.com');
  await form.getByRole('button', { name: 'Send inquiry' }).click();

  await expect(page.getByText('Thank you, Grace.')).toBeVisible();
  expect(requests[0]).toContain('Viewing request: Arden House');
});
