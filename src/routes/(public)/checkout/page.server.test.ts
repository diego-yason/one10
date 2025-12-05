import { describe, it, expect, beforeEach, vi } from 'vitest';

// --- Mock @sveltejs/kit so we can test fail/redirect easily ---
vi.mock('@sveltejs/kit', () => ({
	fail: (status: number, data: any) => ({ status, data }),
	redirect: (status: number, location: string) => ({ status, location })
}));

import { actions } from './+page.server';
import type { CartItem } from '$types/Cart';

// --- Mock environment variables ---
vi.mock('$env/static/public', () => ({
	PUBLIC_MAYA_KEY: 'test-maya-key',
	PUBLIC_BASE_URL: 'https://test.example.com/',
	PUBLIC_MAYA_URL: 'https://api.maya.com'
}));

// --- Mock verifyCart safely ---
vi.mock('$lib/server/verifyCart', () => {
	const mockVerifyCart = vi.fn();
	return {
		verifyCart: mockVerifyCart,
		__mock: { mockVerifyCart }
	};
});

// --- Mock firebase adminDb ---
const mockAdd = vi.fn().mockResolvedValue({ id: 'test-order-id' });
const mockUpdate = vi.fn().mockResolvedValue({});
const mockWhere = vi.fn().mockReturnValue({
	get: vi.fn().mockResolvedValue({
		docs: [{ ref: { update: mockUpdate }, data: () => ({ stock: 10 }) }],
		empty: false
	})
});
vi.mock('$lib/server/firebase', () => ({
	adminDb: {
		collection: vi.fn().mockImplementation((name: string) => {
			if (name === 'orders')
				return { add: mockAdd, doc: () => ({ update: mockUpdate }), where: mockWhere };
			if (name === 'products')
				return { where: mockWhere };
			return {};
		})
	}
}));

// --- Mock checkoutSchema safely ---
vi.mock('./schema', () => {
	const mockSafeParse = vi.fn();
	return {
		checkoutSchema: { safeParse: mockSafeParse },
		__mock: { mockSafeParse }
	};
});

// --- Import references to mocks ---
import * as SchemaModule from './schema';
import * as VerifyCartModule from '$lib/server/verifyCart';

const mockSafeParse = (SchemaModule as any).__mock.mockSafeParse;
const mockVerifyCart = (VerifyCartModule as any).__mock.mockVerifyCart;

// --- Global fetch mock ---
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('Checkout Page Server Actions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('create action', () => {
		const mockRequest = { formData: vi.fn() };

		const validFormData = new FormData();
		validFormData.append('address', '123 Test St');
		validFormData.append('city', 'Test City');
		validFormData.append('email', 'test@example.com');
		validFormData.append('fullName', 'Test User');
		validFormData.append('province', 'Test Province');
		validFormData.append('phone', '1234567890');
		validFormData.append('zip', '12345');
		validFormData.append('cart', JSON.stringify([
			{
				id: 'test-item',
				name: 'Test Item',
				price: 100,
				quantity: 1,
				details: { type: 'film' }
			}
		]));

		it('should create order successfully with valid data', async () => {
			mockRequest.formData.mockResolvedValue(validFormData);

			mockSafeParse.mockReturnValue({
				success: true,
				data: {
					address: '123 Test St',
					city: 'Test City',
					email: 'test@example.com',
					fullName: 'Test User',
					province: 'Test Province',
					phone: '1234567890',
					zip: '12345'
				}
			});

			mockVerifyCart.mockResolvedValue(true);

			mockFetch.mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({
					checkoutId: 'test-checkout-id',
					redirectUrl: 'https://checkout.maya.com/test'
				})
			});

			const result = await actions.create({ fetch: mockFetch, request: mockRequest } as any);

			expect(mockAdd).toHaveBeenCalled();
			expect(mockVerifyCart).toHaveBeenCalled();
			expect(mockFetch).toHaveBeenCalledWith(
				'https://api.maya.com/checkout/v1/checkouts',
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({
						Authorization: expect.stringContaining('Basic'),
						'Content-Type': 'application/json'
					})
				})
			);

			expect(result).toEqual({
				success: true,
				redirectUrl: 'https://checkout.maya.com/test'
			});
		});

		it('should return validation errors for invalid form data', async () => {
			mockSafeParse.mockReturnValue({
				success: false,
				error: {
					issues: [
						{ path: ['email'], message: 'Invalid email format' },
						{ path: ['phone'], message: 'Phone number is required' }
					]
				}
			});

			mockRequest.formData.mockResolvedValue(validFormData);

			const result = await actions.create({ fetch: mockFetch, request: mockRequest } as any);

			expect(result).toEqual({
				status: 400,
				data: {
					error: true,
					issues: {
						email: 'Invalid email format',
						phone: 'Phone number is required'
					}
				}
			});
		});

		it('should redirect to cart when cart verification fails', async () => {
			mockSafeParse.mockReturnValue({ success: true, data: {} });
			mockVerifyCart.mockResolvedValue(false);
			mockRequest.formData.mockResolvedValue(validFormData);

			const result = await actions.create({ fetch: mockFetch, request: mockRequest } as any);

			expect(result).toEqual({
				status: 303,
				location: '/cart?invalid-cart'
			});
		});

		it('should handle Maya API errors', async () => {
			mockSafeParse.mockReturnValue({ success: true, data: {} });
			mockVerifyCart.mockResolvedValue(true);
			mockFetch.mockResolvedValue({
				ok: false,
				json: () => Promise.resolve({ error: 'Payment gateway error' })
			});

			mockRequest.formData.mockResolvedValue(validFormData);

			const result = await actions.create({ fetch: mockFetch, request: mockRequest } as any);

			expect(result).toEqual({
				status: 500,
				// data: { message: 'An error occurred while processing your request. Please try again later.' }
			});
		});

		it('should calculate grand total correctly with addons', async () => {
			mockSafeParse.mockReturnValue({ success: true, data: {} });
			mockVerifyCart.mockResolvedValue(true);
			mockFetch.mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({
					checkoutId: 'test-checkout-id',
					redirectUrl: 'https://checkout.maya.com/test'
				})
			});

			const cartWithAddons = new FormData();
			cartWithAddons.append('address', '123 Test St');
			cartWithAddons.append('city', 'Test City');
			cartWithAddons.append('email', 'test@example.com');
			cartWithAddons.append('fullName', 'Test User');
			cartWithAddons.append('province', 'Test Province');
			cartWithAddons.append('phone', '1234567890');
			cartWithAddons.append('zip', '12345');
			cartWithAddons.append('cart', JSON.stringify([
				{
					id: 'test-item',
					name: 'Test Item',
					price: 100,
					quantity: 2,
					addons: [
						{ id: 'addon-1', name: 'Addon 1', price: 25 },
						{ id: 'addon-2', name: 'Addon 2', price: 15 }
					]
				}
			]));

			mockRequest.formData.mockResolvedValue(cartWithAddons);

			await actions.create({ fetch: mockFetch, request: mockRequest } as any);

			const fetchCall = mockFetch.mock.calls[0];
			const requestBody = JSON.parse(fetchCall[1].body);
			expect(requestBody.totalAmount.value).toBe(280); // (100 + 25 + 15) * 2
		});
	});

	describe('getPayment action', () => {
		const mockRequest = { formData: vi.fn() };

		it('should fail when orderId missing', async () => {
			const formData = new FormData();
			mockRequest.formData.mockResolvedValue(formData);

			const result = await actions.getPayment({ fetch: mockFetch, request: mockRequest } as any);
			expect(result).toEqual({
				status: 400,
				data: { error: 'Order ID is required' }
			});
		});
	});
});
