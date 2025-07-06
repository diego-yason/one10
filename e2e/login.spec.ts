import { test, expect } from '@playwright/test';

test('user can login on /login page', async ({ page }) => {
	// test.setTimeout(); // Extend to handle Firebase delays

	await page.goto('/login');
	console.log('Navigated to /login page');

	// Fill in login credentials
	await page.getByRole('textbox', { name: 'email' }).fill('test@one10studiolab.com');
	await page.getByRole('textbox', { name: 'password' }).fill('testing');

	// Click the "Login" button
	await page.getByText('Login', { exact: true }).click();
	console.log('Login button clicked');

	// Assert that we are redirected to the home page
	await expect(page).toHaveURL('/');
	console.log('Redirected to home page');

	// Assert "Sign Out" button is visible
	await expect(page.getByText('Sign Out', { exact: true })).toBeVisible();
});
