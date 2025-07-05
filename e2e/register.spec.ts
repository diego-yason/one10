import { test, expect } from '@playwright/test';

test('user can register on /register page', async ({ page }) => {
  test.setTimeout(60000); // extend timeout for Firebase + UI delays

  await page.goto('http://localhost:5173/register');

  // Generate unique email to avoid duplicate registration issues
  const timestamp = Date.now();
  const uniqueEmail = `matthew.test.${timestamp}@example.com`;

  // Fill the registration form
  await page.getByRole('textbox', { name: /first name/i }).fill('Matthew');
  await page.getByRole('textbox', { name: /last name/i }).fill('Corral');
  await page.getByRole('textbox', { name: /email/i }).fill(uniqueEmail);
  await page.getByRole('textbox', { name: /password/i }).fill('Kanekiken1236!#');

  // Click the "Sign up" button
  await page.getByRole('button', { name: /^sign up$/i }).click();

  // Wait for redirect and Firebase processing
  await page.waitForTimeout(3000);

  // Assert redirected to home
  await expect(page).toHaveURL('http://localhost:5173/');

  // Assert "Sign Out" button is visible
  await expect(page.getByRole('button', { name: /^sign out$/i })).toBeVisible();

  // Optionally assert that the main heading is visible
  await expect(page.getByRole('heading', { name: /we process your vision/i })).toBeVisible();

  // Optional screenshot for your report
  await page.screenshot({ path: 'register_pass.png', fullPage: true });
});
