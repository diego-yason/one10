import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('$lib/server/firebase', () => {
    const mockCollection = vi.fn();
    const mockWhere = vi.fn();
    const mockGet = vi.fn();
    const mockAdd = vi.fn();
    const mockDoc = vi.fn();
    const mockUpdate = vi.fn();

    return {
        adminDb: {
            collection: mockCollection
        },
        __mocks: { mockCollection, mockWhere, mockGet, mockAdd, mockDoc, mockUpdate }
    };
});

import { GET, POST, PATCH } from './+server';
import * as firebaseModule from '$lib/server/firebase';

const { adminDb, __mocks } = firebaseModule as any;
const { mockCollection, mockWhere, mockGet, mockAdd, mockDoc, mockUpdate } = __mocks;

describe('Orders API Endpoints', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET /api/orders', () => {
		it('should return all orders when no status filter is provided', async () => {
			const mockOrders = [
				{
					id: '1',
					orderId: 'order_123',
					status: 'payment_success',
					grandTotal: 250,
					items: [
						{
							name: 'Test Item',
							quantity: 1,
							amount: { value: 250 }
						}
					]
				},
				{
					id: '2',
					orderId: 'order_456',
					status: 'payment_pending',
					grandTotal: 150,
					items: [
						{
							name: 'Another Item',
							quantity: 1,
							amount: { value: 150 }
						}
					]
				}
			];

			// Mock Firestore query
			mockCollection.mockReturnValue({
				get: mockGet
			});
			mockGet.mockResolvedValue({
				docs: mockOrders.map(order => ({
					id: order.id,
					data: () => order
				}))
			});

			const mockUrl = new URL('https://example.com/api/orders');
			const mockEvent = {
				url: mockUrl
			} as RequestEvent;

			const response = await GET(mockEvent);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual(mockOrders);
			expect(mockCollection).toHaveBeenCalledWith('orders');
		});

		it('should filter orders by status', async () => {
			const mockOrders = [
				{
					id: '1',
					orderId: 'order_123',
					status: 'payment_success',
					grandTotal: 250,
					items: []
				}
			];

			// Mock Firestore query with status filter
			mockCollection.mockReturnValue({
				where: mockWhere
			});
			mockWhere.mockReturnValue({
				get: mockGet
			});
			mockGet.mockResolvedValue({
				docs: mockOrders.map(order => ({
					id: order.id,
					data: () => order
				}))
			});

			const mockUrl = new URL('https://example.com/api/orders?status=payment_success');
			const mockEvent = {
				url: mockUrl
			} as RequestEvent;

			const response = await GET(mockEvent);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual(mockOrders);
			expect(mockWhere).toHaveBeenCalledWith('status', '==', 'payment_success');
		});

		it('should handle Firestore errors', async () => {
			mockCollection.mockReturnValue({
				get: mockGet
			});
			mockGet.mockRejectedValue(new Error('Firestore error'));

			const mockUrl = new URL('https://example.com/api/orders');
			const mockEvent = {
				url: mockUrl
			} as RequestEvent;

			const response = await GET(mockEvent);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data).toEqual({ error: 'Failed to fetch orders' });
		});
	});

	describe('POST /api/orders', () => {
		it('should create a new order successfully', async () => {
			const orderData = {
				orderId: 'order_789',
				status: 'payment_pending',
				grandTotal: 300,
				items: [
					{
						name: 'New Item',
						quantity: 2,
						amount: { value: 150 }
					}
				],
				customerInfo: {
					fullName: 'John Doe',
					email: 'john@example.com',
					phone: '1234567890'
				}
			};

			const mockDocRef = {
				id: 'new-order-id'
			};

			mockCollection.mockReturnValue({
				add: mockAdd
			});
			mockAdd.mockResolvedValue(mockDocRef);

			const mockRequest = {
				json: vi.fn().mockResolvedValue(orderData)
			} as any;

			const mockEvent = {
				request: mockRequest
			} as RequestEvent;

			const response = await POST(mockEvent);
			const data = await response.json();

			expect(response.status).toBe(201);
			expect(data).toEqual({
				success: true,
				orderId: 'new-order-id'
			});

			expect(mockAdd).toHaveBeenCalledWith(orderData);
		});

		it('should handle creation errors', async () => {
			mockCollection.mockReturnValue({
				add: mockAdd
			});
			mockAdd.mockRejectedValue(new Error('Creation failed'));

			const mockRequest = {
				json: vi.fn().mockResolvedValue({})
			} as any;

			const mockEvent = {
				request: mockRequest
			} as RequestEvent;

			const response = await POST(mockEvent);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data).toEqual({ error: 'Failed to create order' });
		});
	});

	describe('PATCH /api/orders', () => {
		it('should update an order successfully', async () => {
			const updateData = {
				orderId: 'order-id',
				status: 'payment_success',
				shippingInfo: {
					trackingNumber: 'TRK123456'
				}
			};

			const mockDocRef = {
				update: mockUpdate
			};

			mockCollection.mockReturnValue({
				doc: mockDoc
			});
			mockDoc.mockReturnValue(mockDocRef);
			mockUpdate.mockResolvedValue(undefined);

			const mockRequest = {
				json: vi.fn().mockResolvedValue(updateData)
			} as any;

			const mockEvent = {
				request: mockRequest
			} as RequestEvent;

			const response = await PATCH(mockEvent);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual({ success: true, orderId: 'order-id' });

			expect(mockDoc).toHaveBeenCalledWith('order-id');
			expect(mockUpdate).toHaveBeenCalledWith({
                status: 'payment_success',
                shippingInfo: {
                  trackingNumber: 'TRK123456'
                }
			});
		});

		it('should handle update errors', async () => {
			mockCollection.mockReturnValue({
				doc: mockDoc
			});
			mockDoc.mockReturnValue({
				update: mockUpdate
			});
			mockUpdate.mockRejectedValue(new Error('Update failed'));

			const mockRequest = {
				json: vi.fn().mockResolvedValue({ orderId: 'order-id' })
			} as any;

			const mockEvent = {
				request: mockRequest
			} as RequestEvent;

			const response = await PATCH(mockEvent);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data).toEqual({ error: 'Failed to update order' });
		});

		it('should require order ID for updates', async () => {
			const mockRequest = {
				json: vi.fn().mockResolvedValue({ status: 'payment_success' })
			} as any;

			const mockEvent = {
				request: mockRequest
			} as RequestEvent;

			const response = await PATCH(mockEvent);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data).toEqual({ error: 'Order ID is required' });
		});
	});
});
