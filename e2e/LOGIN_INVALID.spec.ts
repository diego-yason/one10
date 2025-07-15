import { test, expect } from '@playwright/test';

test('user cannot login with invalid credentials', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('textbox', { name: /email/i }).fill('invalid@example.com');
  await page.getByRole('textbox', { name: /password/i }).fill('wrongpassword');

  await page.getByRole('button', { name: /^login$/i }).click();

  // Expect the actual error message displayed by your app
  await expect(
    page.getByText(/no account found with this email/i)
  ).toBeVisible({
    timeout: 10000
  });
});
