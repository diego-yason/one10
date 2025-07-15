import { test, expect } from '@playwright/test';

test.describe('Cart Page E2E', () => {
  test('should display cart items and allow quantity changes', async ({ page }) => {
    test.setTimeout(90000); // extend for Firebase delays

    // Login first
    await page.goto('http://localhost:5173/login');
    await page.getByRole('textbox', { name: /email/i }).fill('matthewandrecorral@gmail.com');
    await page.getByRole('textbox', { name: /password/i }).fill('Kanekiken1236!#');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('button', { name: /^login$/i }).click(),
    ]);

    // Navigate to cart
    await page.goto('http://localhost:5173/cart');
    await expect(page.getByRole('heading', { name: /^cart$/i })).toBeVisible({ timeout: 10000 });

    // Confirm cart items
    const cartItems = page.locator('div', { hasText: 'film' });
    await expect(cartItems.first()).toBeVisible();

    // Locate the counter container for the first cart item
    const counterContainer = cartItems.first().locator('div.flex.border-1');

    // Correctly target the first quantity span
    const quantityLocator = counterContainer.locator('span').first();

    // Read initial quantity
    const initialQuantityText = await quantityLocator.textContent();
    const initialQuantity = parseInt(initialQuantityText || '0', 10);
    console.log('Initial Quantity:', initialQuantity);

    // Increment
    const incrementButton = counterContainer.getByRole('button', { name: '+' }).first();
    await incrementButton.click();
    await expect(quantityLocator).toHaveText(String(initialQuantity + 1));

    // Decrement
    const decrementButton = counterContainer.getByRole('button', { name: '-' }).first();
    await decrementButton.click();
    await expect(quantityLocator).toHaveText(String(initialQuantity));

    // Screenshot for reporting
    await page.screenshot({ path: 'cart_pass.png', fullPage: true });
  });
});
