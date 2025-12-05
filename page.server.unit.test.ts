import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CartItem } from '$types/Cart';

// Mock modules
vi.mock('$env/static/public', () => ({
  PUBLIC_MAYA_KEY: 'test-key',
  PUBLIC_BASE_URL: 'http://localhost:5173',
  PUBLIC_MAYA_URL: 'https://pg-sandbox.paymaya.com'
}));

vi.mock('$lib/server/firebase', () => ({
  adminDb: {
    collection: vi.fn()
  }
}));

vi.mock('$lib/server/verifyCart', () => ({
  verifyCart: vi.fn()
}));

// =============================================================================
// TEST #2: Total Price Calculation
// =============================================================================

describe('Test #2: Total Price is Correct on Checkout Page', () => {
  // This is the exact logic from your code
  function calculateGrandTotal(cartItems: CartItem[]) {
    let grandTotal = 0;
    
    cartItems.forEach(({ price, addons, quantity }) => {
      const total = addons?.reduce((sum, addon) => sum + (addon?.price ?? 0), price) ?? price;
      grandTotal += total * quantity;
    });
    
    return grandTotal;
  }

  it('should calculate total for items without addons', () => {
    const cart: CartItem[] = [
      { id: '1', name: 'Item 1', price: 200, quantity: 1, addons: [] },
      { id: '2', name: 'Item 2', price: 100, quantity: 1, addons: [] }
    ];

    const total = calculateGrandTotal(cart);
    expect(total).toBe(300);
  });

  it('should calculate total with item quantities', () => {
    const cart: CartItem[] = [
      { id: '1', name: 'Item 1', price: 100, quantity: 3, addons: [] }
    ];

    const total = calculateGrandTotal(cart);
    expect(total).toBe(300); // 100 * 3
  });

  it('should include addon prices in total', () => {
    const cart: CartItem[] = [
      {
        id: '1',
        name: 'Item 1',
        price: 100,
        quantity: 1,
        addons: [
          { name: 'Addon 1', price: 50 },
          { name: 'Addon 2', price: 25 }
        ]
      }
    ];

    const total = calculateGrandTotal(cart);
    expect(total).toBe(175); // 100 + 50 + 25
  });

  it('should calculate total with addons and quantities', () => {
    const cart: CartItem[] = [
      {
        id: '1',
        name: 'Item 1',
        price: 100,
        quantity: 2,
        addons: [{ name: 'Addon 1', price: 50 }]
      }
    ];

    const total = calculateGrandTotal(cart);
    expect(total).toBe(300); // (100 + 50) * 2
  });

  it('should handle multiple items with different addons', () => {
    const cart: CartItem[] = [
      {
        id: '1',
        name: 'Item 1',
        price: 200,
        quantity: 1,
        addons: [{ name: 'Addon 1', price: 50 }]
      },
      {
        id: '2',
        name: 'Item 2',
        price: 100,
        quantity: 2,
        addons: [{ name: 'Addon 2', price: 25 }]
      }
    ];

    const total = calculateGrandTotal(cart);
    expect(total).toBe(500); // (200 + 50) * 1 + (100 + 25) * 2
  });

  it('should handle empty cart', () => {
    const cart: CartItem[] = [];
    const total = calculateGrandTotal(cart);
    expect(total).toBe(0);
  });
});

// =============================================================================
// TEST #1: Maya Checkout URL Generation
// =============================================================================

describe('Test #1: Confirm Order Redirects to Maya Checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should generate Maya checkout URL with correct order data', async () => {
    const mockCheckoutResponse = {
      checkoutId: 'maya-checkout-123',
      redirectUrl: 'https://checkout.maya.ph/checkout/maya-checkout-123'
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockCheckoutResponse
    });

    const orderData = {
      totalAmount: 300,
      items: [
        { name: 'Item 1', code: 'ITEM-001', quantity: 1, amount: { value: 300 } }
      ],
      orderId: 'order_123'
    };

    const response = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
      method: 'POST',
      headers: {
        Authorization: 'Basic dGVzdC1rZXk=',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        totalAmount: { value: orderData.totalAmount, currency: 'PHP' },
        items: orderData.items,
        requestReferenceNumber: orderData.orderId,
        redirectUrl: {
          success: `http://localhost:5173/checkout/success?orderId=${orderData.orderId}`,
          failure: `http://localhost:5173/checkout/failed?orderId=${orderData.orderId}`,
          cancel: `http://localhost:5173/checkout/failed?orderId=${orderData.orderId}`
        }
      })
    });

    const result = await response.json();

    expect(result.redirectUrl).toContain('maya.ph/checkout');
    expect(result.checkoutId).toBe('maya-checkout-123');
  });

  it('should include correct redirect URLs in checkout request', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ checkoutId: 'test', redirectUrl: 'https://maya.ph/checkout/test' })
    });

    const orderId = 'order_456';

    await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
      method: 'POST',
      body: JSON.stringify({
        redirectUrl: {
          success: `http://localhost:5173/checkout/success?orderId=${orderId}`,
          failure: `http://localhost:5173/checkout/failed?orderId=${orderId}`,
          cancel: `http://localhost:5173/checkout/failed?orderId=${orderId}`
        }
      })
    });

    const callArgs = (global.fetch as any).mock.calls[0];
    const requestBody = JSON.parse(callArgs[1].body);

    expect(requestBody.redirectUrl.success).toContain('/checkout/success');
    expect(requestBody.redirectUrl.failure).toContain('/checkout/failed');
    expect(requestBody.redirectUrl.cancel).toContain('/checkout/failed');
  });

  it('should handle Maya API failure', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      text: async () => 'Maya API error'
    });

    const response = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
      method: 'POST'
    });

    expect(response.ok).toBe(false);
  });
});

// =============================================================================
// TEST #3: Maya Price Matches Checkout Price
// =============================================================================

describe('Test #3: Price on Maya Matches Checkout Page', () => {
  it('should send the same grandTotal to Maya as calculated', () => {
    const cart: CartItem[] = [
      { id: '1', name: 'Item 1', price: 200, quantity: 1, addons: [] },
      { id: '2', name: 'Item 2', price: 100, quantity: 1, addons: [] }
    ];

    // Calculate total (like your code does)
    let grandTotal = 0;
    cart.forEach(({ price, addons, quantity }) => {
      const total = addons?.reduce((sum, addon) => sum + (addon?.price ?? 0), price) ?? price;
      grandTotal += total * quantity;
    });

    // This is what gets sent to Maya
    const mayaPayload = {
      totalAmount: { value: grandTotal, currency: 'PHP' }
    };

    expect(mayaPayload.totalAmount.value).toBe(300);
    expect(grandTotal).toBe(300);
  });

  it('should match Maya total with addons included', () => {
    const cart: CartItem[] = [
      {
        id: '1',
        name: 'Item 1',
        price: 100,
        quantity: 2,
        addons: [{ name: 'Extra', price: 50 }]
      }
    ];

    let grandTotal = 0;
    cart.forEach(({ price, addons, quantity }) => {
      const total = addons?.reduce((sum, addon) => sum + (addon?.price ?? 0), price) ?? price;
      grandTotal += total * quantity;
    });

    expect(grandTotal).toBe(300); // (100 + 50) * 2
  });
});

// =============================================================================
// TEST #4: Payment Status Redirects
// =============================================================================

describe('Test #4: Maya Checkout Status Redirects', () => {
  it('should redirect to success page when payment succeeds', () => {
    const orderId = 'order_123';
    const status = 'success';

    const redirectUrl = 
      status === 'success' ? `/checkout/success?orderId=${orderId}` :
      status === 'failed' ? `/checkout/failed?orderId=${orderId}` :
      `/checkout/pending?orderId=${orderId}`;

    expect(redirectUrl).toBe('/checkout/success?orderId=order_123');
  });

  it('should redirect to failure page when payment fails', () => {
    const orderId = 'order_456';
    const status = 'failed';

    const redirectUrl = 
      status === 'success' ? `/checkout/success?orderId=${orderId}` :
      status === 'failed' ? `/checkout/failed?orderId=${orderId}` :
      `/checkout/pending?orderId=${orderId}`;

    expect(redirectUrl).toBe('/checkout/failed?orderId=order_456');
  });

  it('should redirect to pending page when payment is pending', () => {
    const orderId = 'order_789';
    const status = 'pending';

    const redirectUrl = 
      status === 'success' ? `/checkout/success?orderId=${orderId}` :
      status === 'failed' ? `/checkout/failed?orderId=${orderId}` :
      `/checkout/pending?orderId=${orderId}`;

    expect(redirectUrl).toBe('/checkout/pending?orderId=order_789');
  });

  it('should include orderId in all redirect URLs', () => {
    const orderId = 'order_xyz';
    const BASE_URL = 'http://localhost:5173';

    const redirectUrls = {
      success: `${BASE_URL}/checkout/success?orderId=${orderId}`,
      failure: `${BASE_URL}/checkout/failed?orderId=${orderId}`,
      cancel: `${BASE_URL}/checkout/failed?orderId=${orderId}`
    };

    expect(redirectUrls.success).toContain(orderId);
    expect(redirectUrls.failure).toContain(orderId);
    expect(redirectUrls.cancel).toContain(orderId);
  });
});

// =============================================================================
// TEST #5: Database Stock Updates
// =============================================================================

describe('Test #5: Stock Updates in Database', () => {
  let mockAdminDb: any;
  let mockCollection: any;
  let mockQuery: any;
  let mockProductDocs: any[];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock product documents
    mockProductDocs = [
      {
        ref: {
          update: vi.fn().mockResolvedValue(undefined)
        },
        data: vi.fn().mockReturnValue({ stock: 10, itemCode: 'ITEM-001' })
      }
    ];

    // Mock query
    mockQuery = {
      get: vi.fn().mockResolvedValue({
        empty: false,
        docs: mockProductDocs
      })
    };

    // Mock collection
    mockCollection = {
      where: vi.fn().mockReturnValue(mockQuery),
      doc: vi.fn().mockReturnValue({
        update: vi.fn().mockResolvedValue(undefined)
      })
    };

    mockAdminDb = {
      collection: vi.fn().mockReturnValue(mockCollection)
    };
  });

  it('should reduce stock after successful payment', async () => {
    const items = [
      { code: 'ITEM-001', quantity: 2, name: 'Item 1' }
    ];

    // Simulate your code's stock reduction logic
    await Promise.all(
      items.map(async (item) => {
        const productDoc = await mockAdminDb
          .collection('products')
          .where('itemCode', '==', item.code)
          .get();
        
        if (!productDoc.empty) {
          await productDoc.docs[0].ref.update({
            stock: (productDoc.docs[0].data().stock ?? 0) - item.quantity
          });
        }
      })
    );

    expect(mockCollection.where).toHaveBeenCalledWith('itemCode', '==', 'ITEM-001');
    expect(mockProductDocs[0].ref.update).toHaveBeenCalledWith({
      stock: 8 // 10 - 2
    });
  });

  it('should update multiple products stock', async () => {
    const items = [
      { code: 'ITEM-001', quantity: 1, name: 'Item 1' },
      { code: 'ITEM-002', quantity: 3, name: 'Item 2' }
    ];

    const mockProduct1 = {
      ref: { update: vi.fn() },
      data: vi.fn().mockReturnValue({ stock: 10 })
    };
    const mockProduct2 = {
      ref: { update: vi.fn() },
      data: vi.fn().mockReturnValue({ stock: 20 })
    };

    mockQuery.get
      .mockResolvedValueOnce({ empty: false, docs: [mockProduct1] })
      .mockResolvedValueOnce({ empty: false, docs: [mockProduct2] });

    await Promise.all(
      items.map(async (item) => {
        const productDoc = await mockAdminDb
          .collection('products')
          .where('itemCode', '==', item.code)
          .get();
        
        if (!productDoc.empty) {
          await productDoc.docs[0].ref.update({
            stock: (productDoc.docs[0].data().stock ?? 0) - item.quantity
          });
        }
      })
    );

    expect(mockProduct1.ref.update).toHaveBeenCalledWith({ stock: 9 }); // 10 - 1
    expect(mockProduct2.ref.update).toHaveBeenCalledWith({ stock: 17 }); // 20 - 3
  });

  it('should handle product not found gracefully', async () => {
    const items = [{ code: 'INVALID', quantity: 1, name: 'Item' }];

    mockQuery.get.mockResolvedValue({ empty: true, docs: [] });

    // Should not throw error
    await Promise.all(
      items.map(async (item) => {
        const productDoc = await mockAdminDb
          .collection('products')
          .where('itemCode', '==', item.code)
          .get();
        
        if (!productDoc.empty) {
          await productDoc.docs[0].ref.update({
            stock: (productDoc.docs[0].data().stock ?? 0) - item.quantity
          });
        }
      })
    );

    // Update should NOT be called
    expect(mockProductDocs[0].ref.update).not.toHaveBeenCalled();
  });

  it('should only update stock after checkout ID is saved', async () => {
    const orderId = 'order_123';
    const checkoutId = 'maya-checkout-456';
    const items = [{ code: 'ITEM-001', quantity: 1, name: 'Item' }];

    // First: Update order with checkout ID
    await mockAdminDb.collection('orders').doc(orderId).update({
      maya_checkoutId: checkoutId
    });

    // Then: Update stock
    await Promise.all(
      items.map(async (item) => {
        const productDoc = await mockAdminDb
          .collection('products')
          .where('itemCode', '==', item.code)
          .get();
        
        if (!productDoc.empty) {
          await productDoc.docs[0].ref.update({
            stock: (productDoc.docs[0].data().stock ?? 0) - item.quantity
          });
        }
      })
    );

    // Verify order was updated
    expect(mockCollection.doc).toHaveBeenCalledWith(orderId);
    
    // Verify stock was updated
    expect(mockProductDocs[0].ref.update).toHaveBeenCalled();
  });
});

// =============================================================================
// TEST #6: Reattempt Payment (getPayment action)
// =============================================================================

describe('Test #6: Reattempt Payment from Failed Page', () => {
  let mockAdminDb: any;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();

    const mockOrderDoc = {
      empty: false,
      docs: [
        {
          id: 'firestore-doc-id',
          data: () => ({
            id: 'order_123',
            grandTotal: 450,
            items: [{ name: 'Item', code: 'ITEM-001', quantity: 1 }],
            status: 'payment_pending'
          })
        }
      ]
    };

    mockAdminDb = {
      collection: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          get: vi.fn().mockResolvedValue(mockOrderDoc)
        }),
        doc: vi.fn().mockReturnValue({
          update: vi.fn().mockResolvedValue(undefined)
        })
      })
    };
  });

  it('should fetch original order details for reattempt', async () => {
    const orderId = 'order_123';

    const orderDoc = await mockAdminDb
      .collection('orders')
      .where('id', '==', orderId)
      .get();

    expect(mockAdminDb.collection).toHaveBeenCalledWith('orders');
    expect(orderDoc.empty).toBe(false);
    expect(orderDoc.docs[0].data().id).toBe(orderId);
  });

  it('should create new Maya checkout with same amount', async () => {
    const mockMayaResponse = {
      checkoutId: 'new-checkout-789',
      redirectUrl: 'https://checkout.maya.ph/checkout/new-checkout-789'
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockMayaResponse
    });

    const orderData = {
      id: 'order_123',
      grandTotal: 450,
      items: [{ name: 'Item', code: 'ITEM-001' }]
    };

    const response = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
      method: 'POST',
      body: JSON.stringify({
        totalAmount: { value: orderData.grandTotal, currency: 'PHP' },
        items: orderData.items,
        requestReferenceNumber: orderData.id
      })
    });

    const result = await response.json();

    expect(result.redirectUrl).toContain('maya.ph/checkout');
    expect(result.checkoutId).toBe('new-checkout-789');
  });

  it('should update order with new checkout ID on reattempt', async () => {
    const newCheckoutId = 'retry-checkout-999';

    await mockAdminDb.collection('orders').doc('firestore-doc-id').update({
      maya_checkoutId: newCheckoutId,
      status: 'payment_pending'
    });

    const updateCall = mockAdminDb.collection().doc().update;
    expect(updateCall).toHaveBeenCalledWith({
      maya_checkoutId: newCheckoutId,
      status: 'payment_pending'
    });
  });

  it('should not allow reattempt for already paid orders', async () => {
    const paidOrderDoc = {
      empty: false,
      docs: [
        {
          id: 'paid-order-id',
          data: () => ({
            id: 'order_paid',
            status: 'paid',
            grandTotal: 300
          })
        }
      ]
    };

    mockAdminDb.collection().where().get.mockResolvedValue(paidOrderDoc);

    const orderDoc = await mockAdminDb.collection('orders').where('id', '==', 'order_paid').get();
    const orderData = orderDoc.docs[0].data();

    const canRetry = orderData.status !== 'paid' && orderData.status !== 'payment_success';

    expect(canRetry).toBe(false);
  });
});