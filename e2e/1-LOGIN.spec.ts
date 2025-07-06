import { test, expect } from '@playwright/test';

test('[1A] user can login on /login page', async ({ page }) => {
	// test.setTimeout(); // Extend to handle Firebase delays

	await page.goto('/login');
	console.log('Navigated to /login page');

	// Fill in login credentials
	await page.getByRole('textbox', { name: 'email' }).fill('test@one10studiolab.com');
	await page.getByRole('textbox', { name: 'password' }).fill('testing');

	// Click the "Login" button
	await page.getByText('Login', { exact: true }).click();

	// Assert that we are redirected to the home page
	await expect(page).toHaveURL('/');

	// Assert "Sign Out" button is visible
	await expect(page.getByText('Sign Out', { exact: true })).toBeVisible();

	// visit profile page
	// TODO
	// await page.screenshot({ path: "test-results/1-A.png", fullPage: true });
});

test('[1B] invalid password', async ({ page }) => {
	await page.goto('/login');

	// Fill in login credentials
	await page.getByRole('textbox', { name: 'email' }).fill('test@one10studiolab.com');
	await page.getByRole('textbox', { name: 'password' }).fill('wrongpassword');
	await page.getByText('Login', { exact: true }).click();

	await expect(page.getByText('Incorrect password.', { exact: true })).toBeVisible();

	await page.screenshot({ path: 'test-results/1-B.png', fullPage: true });
});
