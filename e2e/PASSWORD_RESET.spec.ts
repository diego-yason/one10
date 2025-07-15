import { test, expect } from '@playwright/test';

test.describe('Password Reset E2E', () => {
  test('user can request a password reset', async ({ page }) => {
    // Navigate to the password reset page
    await page.goto('http://localhost:5173/login/reset');

    // Wait for the page to load visibly
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible({
      timeout: 10000
    });

    // Fill in the email field using placeholder, not label
    await page.getByPlaceholder(/enter your email/i).fill('matthewandrecorral@gmail.com');

    // Click the "Send Reset Link" button
    await page.getByRole('button', { name: /send reset link/i }).click();

    // Assert confirmation message or redirect
    // Adjust based on your actual implementation:
    await expect(
      page.getByText(/check your email|password reset link sent|email sent/i)
    ).toBeVisible({
      timeout: 10000
    });
  });
});
