import { test, expect } from '@playwright/test';

// NOTE: subject for correction once test docs is up
// FIX: @lanc3reyes subject for actual test specs
test.fixme('user can register on /register page', async ({ page }) => {
	await page.goto('/register');

	// Generate unique email to avoid duplicate registration issues
	const timestamp = Date.now();
	const email = `test+${timestamp}@one10studiolab.com`;

	// Fill the registration form
	await page.getByRole('textbox', { name: /first name/i }).fill('Test');
	await page.getByRole('textbox', { name: /last name/i }).fill('User');
	await page.getByRole('textbox', { name: /email/i }).fill(email);
	await page.getByRole('textbox', { name: /password/i }).fill('Password123!');

	// Click the "Sign up" button
	await page.getByText('Sign up', { exact: true }).click();

	// Assert redirected to home
	await expect(page).toHaveURL('/');

	// Assert "Sign Out" button is visible
	await expect(page.getByText('Sign Out', { exact: true })).toBeVisible();
});
