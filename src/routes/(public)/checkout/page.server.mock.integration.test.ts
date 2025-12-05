import { test, describe, beforeAll, afterAll, afterEach, vi, expect } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { actions } from './+page.server';
import { adminDb } from '$lib/server/firebase';
import { verifyCart } from '$lib/server/verifyCart';


vi.mock("$lib/server/verifyCart", () => ({
	verifyCart: vi.fn()
}));

vi.mock("$lib/server/firebase", () => ({
	adminDb: {
		collection: vi.fn().mockReturnThis(),
		add: vi.fn(),
		where: vi.fn().mockReturnThis(),
		doc: vi.fn().mockReturnThis(),
		update: vi.fn(),
		get: vi.fn()
	}
}));


vi.mock("$env/static/public", () => ({
	PUBLIC_MAYA_URL: "https://mock-maya.com",
	PUBLIC_BASE_URL: "https://site.com",
	PUBLIC_MAYA_KEY: "FAKE_KEY"
}));

const { verifyCart } = await import("$lib/server/verifyCart");
const { adminDb } = await import("$lib/server/firebase");


const server = setupServer(
	http.post("https://mock-maya.com/checkout/v1/checkouts", async () => {
		return HttpResponse.json({
			checkoutId: "chk_123",
			redirectUrl: "https://mock-redirect.com/pay"
		});
	})
);

beforeAll(() => server.listen());
afterEach(() => {
	server.resetHandlers();
	vi.clearAllMocks();
});
afterAll(() => server.close());


async function runAction(action, form) {
	return await action({
		request: new Request("http://localhost", {
			method: "POST",
			body: form
		}),
		fetch: fetch
	});
}




test('create → success with addons, stock updates, and Maya redirect', async () => {
  verifyCart.mockResolvedValue(true);

  // Mock Firestore
  const mockOrderDoc = { id: 'ORDER123', update: vi.fn() };
  const mockProductDoc = {
    ref: { update: vi.fn() },
    data: () => ({ stock: 10 })
  };

  const mockCollection = {
    add: vi.fn().mockResolvedValue(mockOrderDoc),
    doc: vi.fn().mockReturnValue(mockOrderDoc),
    where: vi.fn().mockReturnValue({ get: vi.fn().mockResolvedValue({ empty: false, docs: [mockProductDoc] }) })
  };

  adminDb.collection.mockReturnValue(mockCollection);

  const form = new FormData();
  form.set('fullName', 'John Doe');
  form.set('email', 'john@example.com');
  form.set('address', '123 Test St');
  form.set('city', 'Test City');
  form.set('province', 'Test Province');
  form.set('phone', '09123456789');
  form.set('zip', '1111');
  form.set('cart', JSON.stringify([
    { id: 'ITEM-001', name: 'Item 1', price: 100, quantity: 2, addons: [{ name: 'Extra', price: 50 }] }
  ]));

  const result = await runAction(actions.create, form);

 
  expect(result).toEqual({
    success: true,
    redirectUrl: 'https://mock-redirect.com/pay'
  });


  expect(mockProductDoc.ref.update).toHaveBeenCalledWith({ stock: 8 }); // 10 - 2
  expect(mockOrderDoc.update).toHaveBeenCalledWith({ maya_checkoutId: 'chk_123' });
});


test("create → success (valid cart + Maya OK)", async () => {
  verifyCart.mockResolvedValue(true);

  const mockOrderRef = { id: "ORDER123", update: vi.fn() };
  adminDb.collection.mockReturnValue({
    add: vi.fn().mockResolvedValue(mockOrderRef),
    doc: vi.fn().mockReturnValue(mockOrderRef),
    where: vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue({ empty: true }),
    }),
  });

  const form = new FormData();
  form.set("fullName", "John Doe");
  form.set("email", "john@example.com");
  form.set("address", "123");
  form.set("city", "Test City");
  form.set("province", "Test Province");
  form.set("phone", "9293343931");
  form.set("zip", "1111");
  form.set(
    "cart",
    JSON.stringify([
      {
        name: "Item A",
        price: 10,
        quantity: 1,
        addons: [],
        id: "A",
        details: {}
      }
    ])
  );

  const result = await runAction(actions.create, form);

  expect(result).toEqual({
    success: true,
    redirectUrl: "https://mock-redirect.com/pay"
  });

  expect(mockOrderRef.update).toHaveBeenCalledWith({
    maya_checkoutId: "chk_123"
  });
});



test("create → invalid form data returns fail(400)", async () => {
	const form = new FormData();
	form.set("fullName", ""); 

	const result = await runAction(actions.create, form);

	expect(result.status).toBe(400);
	expect(result.data.error).toBe(true);
});



test("create → invalid cart redirects to /cart?invalid-cart", async () => {
	verifyCart.mockResolvedValue(false);

	const form = new FormData();
	form.set("fullName", "John Doe");
	form.set("email", "john@example.com");
	form.set("address", "123");
	form.set("city", "City");
	form.set("province", "Prov");
	form.set("phone", "9293343931");
	form.set("zip", "1111");
	form.set("cart", JSON.stringify([]));

	try {
		await runAction(actions.create, form);
	} catch (e) {
		expect(e.location).toBe("/cart?invalid-cart");
		expect(e.status).toBe(303);
	}
});



test("create → Maya rejects request → fail(500)", async () => {
	verifyCart.mockResolvedValue(true);

	server.use(
		http.post("https://mock-maya.com/checkout/v1/checkouts", () =>
			HttpResponse.json({ error: "Bad request" }, { status: 400 })
		)
	);

	const form = new FormData();
	form.set("fullName", "John Doe");
	form.set("email", "john@example.com");
	form.set("address", "123");
	form.set("city", "City");
	form.set("province", "Prov");
	form.set("phone", "9293343931");
	form.set("zip", "1111");
	form.set(
		"cart",
		JSON.stringify([
			{ name: "A", price: 10, quantity: 1, id: "A", addons: [], details: {} }
		])
	);

	const result = await runAction(actions.create, form);

	expect(result.status).toBe(500);
	expect(result.data.message).toBe("Payment provider rejected the request");
});


test("getPayment → success (Maya OK)", async () => {
	adminDb.where.mockReturnValue({
		get: () =>
			Promise.resolve({
				empty: false,
				docs: [
					{
						id: "doc1",
						data: () => ({
							id: "ORDER123",
							status: "payment_pending",
							grandTotal: 100,
							items: []
						})
					}
				]
			})
	});

	adminDb.doc.mockReturnValue({
		update: vi.fn()
	});

	const form = new FormData();
	form.set("orderId", "ORDER123");

	try {
		await runAction(actions.getPayment, form);
	} catch (e) {
		expect(e.status).toBe(303);
		expect(e.location).toBe("https://mock-redirect.com/pay");
	}
});



test("getPayment → missing orderId returns fail(400)", async () => {
	const form = new FormData();

	const result = await runAction(actions.getPayment, form);

	expect(result.status).toBe(400);
});



test("getPayment → order not found returns fail(404)", async () => {
	adminDb.where.mockReturnValue({
		get: () => Promise.resolve({ empty: true })
	});

	const form = new FormData();
	form.set("orderId", "ORDER123");

	const result = await runAction(actions.getPayment, form);

	expect(result.status).toBe(404);
});



test("getPayment → already paid returns fail(400)", async () => {
  adminDb.collection.mockReturnValue({
    where: vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue({
        empty: false,
        docs: [
          {
            id: "doc1",
            data: () => ({
              status: "paid"
            })
          }
        ]
      })
    })
  });

  const form = new FormData();
  form.set("orderId", "ORDER123");

  const result = await runAction(actions.getPayment, form);

  expect(result.status).toBe(400);
});

test("getPayment → Maya rejects request → fail(500)", async () => {
  adminDb.collection.mockReturnValue({
    where: vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue({
        empty: false,
        docs: [
          {
            id: "doc1",
            data: () => ({
              id: "ORDER123",
              status: "payment_pending",
              grandTotal: 100,
              items: []
            })
          }
        ]
      })
    }),
    doc: vi.fn().mockReturnValue({
      update: vi.fn().mockResolvedValue(undefined)
    })
  });

  server.use(
    http.post("https://mock-maya.com/checkout/v1/checkouts", () =>
      new HttpResponse(
        JSON.stringify({ error: "failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    )
  );

  const form = new FormData();
  form.set("orderId", "ORDER123");

  const result = await runAction(actions.getPayment, form);

  expect(result.status).toBe(500);


  
});

test('getPayment → already paid returns fail(400)', async () => {
  const orderDoc = {
    empty: false,
    docs: [
      {
        id: 'paid-doc',
        data: () => ({ id: 'ORDERPAID', status: 'paid' })
      }
    ]
  };

  adminDb.collection.mockReturnValue({
    where: vi.fn().mockReturnValue({ get: vi.fn().mockResolvedValue(orderDoc) })
  });

  const form = new FormData();
  form.set('orderId', 'ORDERPAID');

  const result = await runAction(actions.getPayment, form);

  expect(result.status).toBe(400);
});


test('getPayment → reattempt payment updates checkout ID', async () => {
  const orderDoc = {
    empty: false,
    docs: [
      {
        id: 'doc1',
        data: () => ({
          id: 'ORDER123',
          grandTotal: 300,
          items: [{ name: 'Item 1', code: 'ITEM-001', quantity: 1 }],
          status: 'payment_pending'
        }),
        ref: { update: vi.fn().mockResolvedValue(undefined) } 
      }
    ]
  };

  adminDb.collection.mockReturnValue({
    where: vi.fn().mockReturnValue({ get: vi.fn().mockResolvedValue(orderDoc) }), 
    doc: vi.fn().mockReturnValue(orderDoc.docs[0].ref)
  });

  adminDb.collection.mockReturnValue({
      where: vi.fn().mockReturnValue({ get: vi.fn().mockResolvedValue(orderDoc) }),
      doc: vi.fn().mockReturnValue(orderDoc.docs[0].ref)
  });


  const form = new FormData();
  form.set('orderId', 'ORDER123');

  try {
    await runAction(actions.getPayment, form);
    
    throw new Error('Action did not redirect as expected'); 
  } catch (e) {
    expect(e.status).toBe(303);
    expect(e.location).toBe('https://mock-redirect.com/pay');
  }
  expect(orderDoc.docs[0].ref.update).toHaveBeenCalledWith({
    maya_checkoutId: 'chk_123',
    status: 'payment_pending'
  });
});