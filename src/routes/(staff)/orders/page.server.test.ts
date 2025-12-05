import { describe, it, expect, beforeEach, vi } from 'vitest';
import { load } from './+page.server';
import type { Order } from '$types/firebase/Orders';

vi.mock('$lib/server/firebase', () => {
  return {
    adminDb: {
      collection: vi.fn()
    }
  };
});

import { adminDb } from '$lib/server/firebase';

describe('Staff Orders Page — load()', () => {
  let mockCollection: any;
  let mockGet: any;

  beforeEach(() => {
    mockGet = vi.fn();
    mockCollection = {
      get: mockGet
    };
    (adminDb.collection as any).mockReturnValue(mockCollection);
  });

  describe('Paid Orders Accurately Reflect Order Details', () => {
    it('should return an order with correct sizes, copies, and total price', async () => {

      const mockOrder: Order = {
        id: 'order_123',
        name: 'John Doe',
        email: 'john@email.com',
        phone: '09123456789',
        status: 'payment_success',
        grandTotal: 40,
        address: {
          address: '123 St',
          city: 'Manila',
          province: 'Metro Manila',
          postalCode: '1000'
        },
        notes: '',
        items: [
          {
            itemCode: 'PRINT_3R',
            name: '3R Photo',
            quantity: 2,
            price: 10,
            addons: [],
            details: {
              size: '3R',
              copies: 2
            },
            notes: ''
          },
          {
            itemCode: 'PRINT_5R',
            name: '5R Photo',
            quantity: 1,
            price: 20,
            addons: [],
            details: {
              size: '5R',
              copies: 1
            },
            notes: ''
          }
        ],
        maya_checkoutId: undefined
      };

      mockGet.mockResolvedValue({
        docs: [
          {
            data: () => mockOrder
          }
        ]
      });

      const result = await load();

      expect(adminDb.collection).toHaveBeenCalledWith('orders');
      expect(mockGet).toHaveBeenCalled();

      // Should return exactly 1 order
      expect(result.orders.length).toBe(1);

      const order = result.orders[0];

      // Extract data from details[] instead of top-level fields
      const sizes = order.items.map(i => i.details.size);
      const copies = order.items.map(i => i.details.copies);

      expect(sizes).toEqual(['3R', '5R']);
      expect(copies).toEqual([2, 1]);

      // Core order checks
      expect(order.grandTotal).toBe(40);
      expect(order.status).toBe('payment_success');
      expect(order.id).toBe('order_123');
    });
  });
});
