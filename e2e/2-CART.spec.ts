import { test, expect } from '@playwright/test';

// NOTE: subject for correction once test docs is up
test('[2A] Load cart when storage empty', async ({ page }) => {
	await page.goto('/');

	await page.evaluate(() => {
		// TODO: instead of clearing localStorage, clear the cart itself
		// @Strat000 for updating -diego
		localStorage.clear();
	});

	await page.goto('/cart');
	await expect(page.getByText('Cart', { exact: true })).toBeVisible();
	await expect(page.getByText('Your cart is empty', { exact: true })).toBeVisible();
});

test.fixme('[2B] Load cart with saved items', async ({ page }) => {
	await page.goto('/');

	await page.evaluate(() => {
		// TODO: add key
		// @Strat000 for updating -diego
		localStorage.setItem('cart', JSON.stringify([]));
	});
});

test.fixme('[2C] Add item to cart', async ({ page }) => {});
test.fixme('[2D] Clear storage', async ({ page }) => {});
test.fixme('[2E] Order Summary Total', async ({ page }) => {});
