import { test, expect } from '@playwright/test';

test('Add Service to Cart', async ({ page }) => {
	// Recording...
	await page.goto('http://localhost:5173/');
	await page.getByRole('link', { name: 'Store' }).click();
	await page.getByRole('link', { name: 'Disposable Camera Disposable' }).click();
	await expect(page.getByRole('slider', { name: 'PUSH PROCESSING' })).toHaveValue('0');
	await expect(page.locator('form')).toContainText('P0');
	await expect(page.locator('form')).toContainText('(+P0)');
	await expect(page.getByLabel('PROCESS TYPE')).toContainText('Select process type');
	await page.getByRole('textbox', { name: 'FILM BRAND NAME' }).click();
	await page.getByRole('textbox', { name: 'FILM BRAND NAME' }).fill('Test Brand');
	await page.getByText('Back to Store Develop +').click();
	await page.getByRole('checkbox', { name: "I'd like to get my negatives" }).check();
	await page.locator('#returningNegatives').selectOption('traditional');
	await page.getByRole('radio', { name: 'SCAN FILM AND EMAIL ME SOFT' }).check();
	await page.getByLabel('PROCESS TYPE').selectOption('bw');
	await expect(page.locator('form')).toContainText('(+P120)');
	await expect(page.locator('form')).toContainText('P370');
	await page.getByLabel('PROCESS TYPE').selectOption('ecn2');
	await expect(page.locator('form')).toContainText('(+P200)');
	await expect(page.locator('form')).toContainText('P550');
	await page.getByLabel('PROCESS TYPE').selectOption('c41');
	await expect(page.locator('form')).toContainText('(+P150)');
	await expect(page.locator('form')).toContainText('P350');
	await page.getByRole('slider', { name: 'PUSH PROCESSING' }).fill('2');
	await expect(page.locator('form')).toContainText('(+P250)');
	await page.getByRole('slider', { name: 'PUSH PROCESSING' }).fill('3');
	await expect(page.locator('form')).toContainText('(+P300)');
	await page.getByRole('slider', { name: 'PUSH PROCESSING' }).fill('1');
	await expect(page.locator('form')).toContainText('(+P150)');
	await page.getByRole('slider', { name: 'PUSH PROCESSING' }).fill('0');
	await expect(page.locator('form')).toContainText('(+P0)');
	await page.getByRole('slider', { name: 'PUSH PROCESSING' }).fill('2');
	await page.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.getByRole('textbox', { name: 'FILM BRAND NAME' })).toBeEmpty();
	await expect(page.getByLabel('PROCESS TYPE')).toContainText('Select process type');
	await expect(page.locator('form')).toContainText('(+P0)');
	await expect(page.locator('form')).toContainText('(+P0)');
	await expect(page.locator('form')).toContainText('P0');
	await expect(page.getByRole('slider', { name: 'PUSH PROCESSING' })).toHaveValue('0');
	await page.goto('http://localhost:5173/store/disposable');
	await expect(page.getByRole('radio', { name: 'SCAN FILM AND EMAIL ME SOFT' })).not.toBeChecked();
	await expect(
		page.getByRole('radio', { name: 'PROCESS ONLY (I WILL SCAN AND' })
	).not.toBeChecked();
	await expect(page.getByRole('checkbox', { name: 'Generic Brand' })).not.toBeChecked();
	await expect(
		page.getByRole('checkbox', { name: "I'd like to get my negatives" })
	).not.toBeChecked();
	await page.getByRole('checkbox', { name: "I'd like to get my negatives" }).check();
	await expect(page.locator('#returningNegatives')).toBeEmpty();
});
