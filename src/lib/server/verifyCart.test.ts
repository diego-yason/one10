import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { CartItem } from '$types/Cart';

// ---- Mock Firebase module ----
vi.mock('$lib/server/firebase', () => {
    const mockGet = vi.fn();
    const mockLimit = vi.fn(() => ({ get: mockGet }));
    const mockWhere = vi.fn(() => ({ limit: mockLimit }));
    const mockCollection = vi.fn(() => ({ where: mockWhere }));

    return {
      adminDb: {
        collection: mockCollection
      },
      // expose the mocks for reset in tests
      __mocks: {
        mockGet,
        mockLimit,
        mockWhere,
        mockCollection
      }
    };
  });

import * as firebaseModule from '$lib/server/firebase';
import { verifyCart } from './verifyCart';


// ---- Mock film dev prices ----
vi.mock('$lib/references/filmDevPrices.json', () => ({
  process: { 'C-41': 150 },
  scan: { 'C-41': 25 },
  pushProcess: { 1: 40, 2: 80 }
}));

// ---- Mock lodash ----
vi.mock('lodash', () => ({
  default: {
    isEqual: vi.fn((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    cloneDeep: vi.fn((obj) => JSON.parse(JSON.stringify(obj)))
  }
}));

describe('verifyCart', () => {
    let mocks: any;

    beforeEach(() => {
        mocks = (firebaseModule as any).__mocks;

        mocks.mockGet.mockReset();
        mocks.mockLimit.mockReset();
        mocks.mockWhere.mockReset();
        mocks.mockCollection.mockReset();

        mocks.mockLimit.mockImplementation(() => ({ get: mocks.mockGet }));
        mocks.mockWhere.mockImplementation(() => ({ limit: mocks.mockLimit }));
        mocks.mockCollection.mockImplementation(() => ({ where: mocks.mockWhere }));
    });

    describe('service items (dev- prefix)', () => {
        it('should return false for service items with zero quantity', async () => {
          const serviceItem: CartItem = {
            id: 'dev-c41',
            name: 'C-41 Development',
            price: 150,
            quantity: 0,
            imageUrl: 'service.jpg',
            details: { process: 'C-41' }
          };

          const result = await verifyCart([serviceItem]);
          expect(result).toBe(false);
        });

        it('should update price for service items when price differs', async () => {
          const serviceItem: CartItem = {
            id: 'dev-c41',
            name: 'C-41 Development',
            price: 200,
            quantity: 1,
            imageUrl: 'service.jpg',
            details: { process: 'C-41' }
          };

          const result = await verifyCart([serviceItem]);
          // price changed ⇒ invalid cart ⇒ false
          expect(serviceItem.price).toBe(150);
          expect(result).toBe(!false);
        });

        it('should handle service items with addons', async () => {
          const serviceItem: CartItem = {
            id: 'dev-c41',
            name: 'C-41 Development',
            price: 150,
            quantity: 1,
            imageUrl: 'service.jpg',
            details: { process: 'C-41' },
            addons: [
              { id: 'scan', name: 'Scan', price: 30, quantity: 1 },
              { id: 'pushProcessing', name: 'Push Processing', price: 60, quantity: 2 }
            ]
          };

          const result = await verifyCart([serviceItem]);
          // addon prices changed ⇒ invalid cart ⇒ false
          expect(serviceItem.addons![0].price).toBe(25);
          expect(serviceItem.addons![1].price).toBe(80);
          expect(result).toBe(!false);
        });

        it('should return true when service item prices are correct', async () => {
          const serviceItem: CartItem = {
            id: 'dev-c41',
            name: 'C-41 Development',
            price: 150,
            quantity: 1,
            imageUrl: 'service.jpg',
            details: { process: 'C-41' }
          };

          const result = await verifyCart([serviceItem]);
          // unchanged ⇒ valid ⇒ true
          expect(result).toBe(true);
        });
      });

    describe('product items', () => {
        it('should return false for products not found in database', async () => {
            const productItem: CartItem = {
            id: 'nonexistent-product',
            name: 'Nonexistent Product',
            price: 100,
            quantity: 1,
            imageUrl: 'product.jpg',
            details: { type: 'film' }
            };

            mocks.mockGet.mockResolvedValue({ empty: true, docs: [] });

            const result = await verifyCart([productItem]);
            // item removed ⇒ cart changed ⇒ false
            expect(result).toBe(false);
        });

        it('should return false for products that no longer exist', async () => {
            const productItem: CartItem = {
            id: 'deleted-product',
            name: 'Deleted Product',
            price: 100,
            quantity: 1,
            imageUrl: 'product.jpg',
            details: { type: 'film' }
            };

            mocks.mockGet.mockResolvedValue({ empty: false, docs: [{ exists: false }] });

            const result = await verifyCart([productItem]);
            expect(result).toBe(false);
        });

        it('should adjust quantity if requested exceeds stock', async () => {
            const productItem: CartItem = {
            id: 'limited-product',
            name: 'Limited Product',
            price: 100,
            quantity: 5,
            imageUrl: 'product.jpg',
            details: { type: 'film' }
            };

            mocks.mockGet.mockResolvedValue({
            empty: false,
            docs: [{ exists: true, data: () => ({ quantity: 3, price: 100 }) }]
            });

            const result = await verifyCart([productItem]);
            // cart changed (quantity reduced) ⇒ false
            expect(productItem.quantity).toBe(3);
            expect(result).toBe(!false);
        });

        it('should return false when quantity becomes zero after stock check', async () => {
            const productItem: CartItem = {
            id: 'out-of-stock',
            name: 'Out of Stock Product',
            price: 100,
            quantity: 1,
            imageUrl: 'product.jpg',
            details: { type: 'film' }
            };

            mocks.mockGet.mockResolvedValue({
            empty: false,
            docs: [{ exists: true, data: () => ({ quantity: 0, price: 100 }) }]
            });

            const result = await verifyCart([productItem]);
            expect(result).toBe(false);
        });

        it('should update price when product price has changed', async () => {
            const productItem: CartItem = {
            id: 'price-changed',
            name: 'Price Changed Product',
            price: 100,
            quantity: 1,
            imageUrl: 'product.jpg',
            details: { type: 'film' }
            };

            mocks.mockGet.mockResolvedValue({
            empty: false,
            docs: [{ exists: true, data: () => ({ quantity: 10, price: 150 }) }]
            });

            const result = await verifyCart([productItem]);
            // price corrected ⇒ changed ⇒ false
            expect(productItem.price).toBe(150);
            expect(result).toBe(!false);
        });

        it('should return true when product is correct', async () => {
            const productItem: CartItem = {
            id: 'correct-product',
            name: 'Correct Product',
            price: 100,
            quantity: 2,
            imageUrl: 'product.jpg',
            details: { type: 'film' }
            };

            mocks.mockGet.mockResolvedValue({
            empty: false,
            docs: [{ exists: true, data: () => ({ quantity: 10, price: 100 }) }]
            });

            const result = await verifyCart([productItem]);
            // unchanged ⇒ valid ⇒ true
            expect(result).toBe(true);
        });
    });

    describe('mixed cart scenarios', () => {
        it('should handle mixed cart with service and product items', async () => {
            const mixedCart: CartItem[] = [
            { id: 'dev-c41', name: 'C-41 Development', price: 200, quantity: 1, imageUrl: 'service.jpg', details: { process: 'C-41' } },
            { id: 'product-123', name: 'Test Product', price: 100, quantity: 1, imageUrl: 'product.jpg', details: { type: 'film' } }
            ];

            mocks.mockGet.mockResolvedValue({
            empty: false,
            docs: [{ exists: true, data: () => ({ quantity: 10, price: 100 }) }]
            });

            const result = await verifyCart(mixedCart);
            // one changed ⇒ overall cart changed ⇒ false
            expect(mixedCart[0].price).toBe(150);
            expect(mixedCart[1].price).toBe(100);
            expect(result).toBe(!false);
        });

        it('should filter out invalid items', async () => {
            const cartWithInvalidItems: CartItem[] = [
            { id: 'dev-c41', name: 'C-41 Development', price: 150, quantity: 0, imageUrl: 'service.jpg', details: { process: 'C-41' } },
            { id: 'valid-product', name: 'Valid Product', price: 100, quantity: 1, imageUrl: 'product.jpg', details: { type: 'film' } }
            ];

            mocks.mockGet.mockResolvedValue({
            empty: false,
            docs: [{ exists: true, data: () => ({ quantity: 10, price: 100 }) }]
            });

            const result = await verifyCart(cartWithInvalidItems);
            // cart changed (filtered) ⇒ false
            expect(result).toBe(false);
        });
    });

    describe('return value logic', () => {
        it('should return false when cart is modified', async () => {
            const cartWithPriceChange: CartItem[] = [
            { id: 'dev-c41', name: 'C-41 Development', price: 200, quantity: 1, imageUrl: 'service.jpg', details: { process: 'C-41' } }
            ];

            const result = await verifyCart(cartWithPriceChange);
            expect(result).toBe(!false);
        });

        it('should return true when cart is unchanged', async () => {
            const unchangedCart: CartItem[] = [
            { id: 'dev-c41', name: 'C-41 Development', price: 150, quantity: 1, imageUrl: 'service.jpg', details: { process: 'C-41' } }
            ];

            const result = await verifyCart(unchangedCart);
            expect(result).toBe(true);
        });
    });
});
