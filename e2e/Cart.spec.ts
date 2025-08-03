import { test, expect } from '@playwright/test';

test('[CART] Add item and remove from cart', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('link', { name: 'Cart' }).click();
	await page.goto('http://localhost:5173/');
	expect(page.getByText('Your cart is empty.')).toBeVisible();
	await page.getByRole('link', { name: 'Go to Products' }).click();
	await page.getByRole('link', { name: 'Disposable Camera Disposable' }).click();
	await page.getByRole('checkbox', { name: 'Generic Brand' }).check();
	await page.getByLabel('PROCESS TYPE').selectOption('c41');
	await page.getByRole('slider', { name: 'PUSH PROCESSING' }).fill('2');
	await page.getByRole('checkbox', { name: "I'd like to get my negatives" }).check();
	await page.getByText("RETURNING NEGATIVES I'd like").click();
	await page.locator('#returningNegatives').selectOption('traditional');
	await page.getByText('SCAN FILM AND EMAIL ME SOFT').click();
	await page.getByText('SCAN FILM AND EMAIL ME SOFT').click();
	await page.getByRole('button', { name: 'Add to cart' }).click();
	await page.getByRole('link', { name: 'Cart' }).click();
	await expect(page.getByRole('main')).toContainText('P600');
	await expect(
		page.getByText('Film Development (disposable): Generic Brand Base Price: P200 Details Film')
	).toBeVisible();
	await expect(page.getByRole('link', { name: 'Checkout' })).toBeVisible();
	await page.getByRole('button', { name: 'Clear Cart' }).click();
	await expect(page.getByText('Your cart is empty.')).toBeVisible();
});
