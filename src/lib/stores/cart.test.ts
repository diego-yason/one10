import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	cart,
	add,
	remove,
	updateQuantity,
	clear,
	showToast,
	toast,
	getTotalPrice,
} from './cart';
import { verifyCart } from '$lib/server/verifyCart';
import type { CartItem } from '$types/Cart';

// ------------------------
// Mock $lib/server/firebase (Admin SDK version used in verifyCart)
// ------------------------
vi.mock('$lib/server/firebase', () => {
	const mockGet = vi.fn();
	const mockLimit = vi.fn(() => ({ get: mockGet }));
	const mockWhere = vi.fn(() => ({ limit: mockLimit }));
	const mockCollection = vi.fn(() => ({ where: mockWhere }));

	return {
		adminDb: {
			collection: mockCollection
		},
		__mocks: {
			mockGet,
			mockLimit,
			mockWhere,
			mockCollection
		}
	};
});

// ------------------------
// Mock film development prices (named exports expected by code)
// ------------------------
vi.mock('$lib/references/filmDevPrices.json', () => ({
	process: {
		'C-41': 150,
		'B&W': 100,
		'E-6': 200
	},
	pushProcess: {
		1: 50,
		2: 80,
		3: 100
	},
	scan: {
		'C-41': 25,
		'B&W': 20,
		'E-6': 30
	}
}));

// ------------------------
// Mock lodash
// ------------------------
vi.mock('lodash', () => ({
	default: {
		isEqual: vi.fn((a, b) => JSON.stringify(a) === JSON.stringify(b))
	}
}));

// ------------------------
// Import adminDb mocks after definition
// ------------------------
import * as firebaseModule from '$lib/server/firebase';
let mocks: any;

// ------------------------
// Main test suite
// ------------------------
describe('Cart Store', () => {
	beforeEach(() => {
		clear();
		vi.clearAllMocks();

		const firebaseMocks = (firebaseModule as any).__mocks;
		mocks = firebaseMocks;

		mocks.mockGet.mockReset();
		mocks.mockCollection.mockReset();
		mocks.mockWhere.mockReset();
		mocks.mockLimit.mockReset();
	});

	describe('add function', () => {
		it('should add a new item to empty cart', () => {
			const item: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film' }
			};

			add(item);

			const cartItems = get(cart);
			expect(cartItems).toHaveLength(1);
			expect(cartItems[0]).toEqual(item);
		});

		it('should increase quantity when adding same item with same details', () => {
			const item: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film' }
			};

			add(item);
			add(item);

			const cartItems = get(cart);
			expect(cartItems).toHaveLength(1);
			expect(cartItems[0].quantity).toBe(2);
		});

		it('should add as separate item when details are different', () => {
			const item1: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film', process: 'C-41' }
			};

			const item2: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film', process: 'B&W' }
			};

			add(item1);
			add(item2);

			const cartItems = get(cart);
			expect(cartItems).toHaveLength(2);
			expect(cartItems[0].quantity).toBe(1);
			expect(cartItems[1].quantity).toBe(1);
		});

		it('should add as separate item when notes are different', () => {
			const item1: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film' },
				notes: 'Special instructions'
			};

			const item2: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film' },
				notes: 'Different instructions'
			};

			add(item1);
			add(item2);

			const cartItems = get(cart);
			expect(cartItems).toHaveLength(2);
		});
	});

	describe('remove function', () => {
		it('should remove item at specified index', () => {
			const item1: CartItem = {
				id: 'test-item-1',
				name: 'Test Item 1',
				price: 100,
				quantity: 1,
				imageUrl: 'test1.jpg',
				details: { type: 'film' }
			};

			const item2: CartItem = {
				id: 'test-item-2',
				name: 'Test Item 2',
				price: 200,
				quantity: 1,
				imageUrl: 'test2.jpg',
				details: { type: 'film' }
			};

			add(item1);
			add(item2);

			remove(0);

			const cartItems = get(cart);
			expect(cartItems).toHaveLength(1);
			expect(cartItems[0].id).toBe('test-item-2');
		});

		it('should handle removing from empty cart gracefully', () => {
			expect(() => remove(0)).not.toThrow();
		});
	});

	describe('updateQuantity function', () => {
		it('should update quantity of item at specified index', () => {
			const item: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film' }
			};

			add(item);
			updateQuantity(0, 3);

			const cartItems = get(cart);
			expect(cartItems[0].quantity).toBe(3);
		});

		it('should remove item when quantity is set to 0', () => {
			const item: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film' }
			};

			add(item);
			updateQuantity(0, 0);

			const cartItems = get(cart);
			expect(cartItems).toHaveLength(0);
		});

		it('should remove item when quantity is negative', () => {
			const item: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film' }
			};

			add(item);
			updateQuantity(0, -1);

			const cartItems = get(cart);
			expect(cartItems).toHaveLength(0);
		});
	});

	describe('clear function', () => {
		it('should empty the cart', () => {
			const item: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film' }
			};

			add(item);
			clear();

			const cartItems = get(cart);
			expect(cartItems).toHaveLength(0);
		});
	});

	describe('showToast function', () => {
		it('should set toast message', () => {
			showToast('Test message');

			const toastMessage = get(toast);
			expect(toastMessage).toBe('Test message');
		});

		it('should clear toast after timeout', async () => {
			vi.useFakeTimers();

			showToast('Test message');
			expect(get(toast)).toBe('Test message');

			vi.advanceTimersByTime(2000);
			expect(get(toast)).toBe(null);

			vi.useRealTimers();
		});
	});

	describe('getTotalPrice function', () => {
		it('should calculate total price without addons', () => {
			const item: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 2,
				imageUrl: 'test.jpg',
				details: { type: 'film' }
			};

			const total = getTotalPrice(item);
			expect(total).toBe(200);
		});

		it('should calculate total price with addons', () => {
			const item: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 2,
				imageUrl: 'test.jpg',
				details: { type: 'film' },
				addons: [
					{ id: 'addon-1', name: 'Addon 1', price: 25, quantity: 1 },
					{ id: 'addon-2', name: 'Addon 2', price: 15, quantity: 1 }
				]
			};

			const total = getTotalPrice(item);
			expect(total).toBe(280); // (100 + 25 + 15) * 2
		});

		it('should handle item without addons', () => {
			const item: CartItem = {
				id: 'test-item-1',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				imageUrl: 'test.jpg',
				details: { type: 'film' }
			};

			const total = getTotalPrice(item);
			expect(total).toBe(100);
		});
	});

	describe('verifyCart function', () => {
		it('should handle service items (dev- prefix) correctly', async () => {
			const serviceItem: CartItem = {
				id: 'dev-c41',
				name: 'C-41 Development',
				price: 150,
				quantity: 1,
				imageUrl: 'service.jpg',
				details: { process: 'C-41' }
			};

			add(serviceItem);

			const cartItems = get(cart);
			const result = await verifyCart(cartItems);
			expect(result).toBe(true); // not modified
		});

		it('should call Firestore get() for product items', async () => {
			const productItem: CartItem = {
				id: 'product-123',
				name: 'Test Product',
				price: 100,
				quantity: 2,
				imageUrl: 'product.jpg',
				details: { type: 'film' }
			};

			add(productItem);

			const mockDocSnapshot = {
				exists: true,
				data: () => ({
					quantity: 5,
					price: 100
				})
			};

			const mockQuerySnapshot = {
				empty: false,
				docs: [mockDocSnapshot]
			};

			mocks.mockGet.mockResolvedValue(mockQuerySnapshot);

			const cartItems = get(cart);
			const modified = await verifyCart(cartItems);

			expect(mocks.mockGet).toHaveBeenCalled();
			expect(modified).toBe(true);
		});

		it('should handle items that no longer exist in database', async () => {
			const productItem: CartItem = {
				id: 'nonexistent-product',
				name: 'Nonexistent Product',
				price: 100,
				quantity: 1,
				imageUrl: 'product.jpg',
				details: { type: 'film' }
			};

			add(productItem);

			const mockQuerySnapshot = {
				empty: true,
				docs: []
			};

			mocks.mockGet.mockResolvedValue(mockQuerySnapshot);

			const cartItems = get(cart);
			const modified = await verifyCart(cartItems);

			expect(mocks.mockGet).toHaveBeenCalled();
			expect(modified).toBe(false);
		});
	});
});
