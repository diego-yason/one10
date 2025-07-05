import { test, expect } from '@playwright/test';

test('user can login on /login page', async ({ page }) => {
  test.setTimeout(60000); // Extend to handle Firebase delays

  await page.goto('http://localhost:5173/login');

  // Fill in login credentials
  await page.getByRole('textbox', { name: /email/i }).fill('matthewandrecorral@gmail.com');
  await page.getByRole('textbox', { name: /password/i }).fill('Kanekiken1236!#');

  // Click the "Login" button
  await page.getByRole('button', { name: /^login$/i }).click();

  // Wait for Firebase redirect and DOM updates
  await page.waitForTimeout(3000);

  // Assert that we are redirected to the home page
  await expect(page).toHaveURL('http://localhost:5173/');

  // Assert "Sign Out" button is visible
  await expect(page.getByRole('button', { name: /^sign out$/i })).toBeVisible();

  // Optional: Confirm main heading
  await expect(page.getByRole('heading', { name: /we process your vision/i })).toBeVisible();

  // Optional debug screenshot
  await page.screenshot({ path: 'login_pass.png', fullPage: true });
});
