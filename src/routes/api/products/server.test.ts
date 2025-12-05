import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

let GET: any;
let POST: any;
let PATCH: any;

const mockCollection = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockGet = vi.fn();
const mockAdd = vi.fn();
const mockDoc = vi.fn();
const mockUpdate = vi.fn();

const mockAdminDb = {
  collection: mockCollection
};

beforeAll(async () => {
  vi.doMock('$lib/server/firebase', () => ({
    adminDb: mockAdminDb
  }));

  const mod = await import('./+server');
  GET = mod.GET;
  POST = mod.POST;
  PATCH = mod.PATCH;
});

describe('Products API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return all products when no filters are provided', async () => {
      const mockProducts = [
        { id: '1', name: 'Test Product 1', price: 100, category: 'film', status: 'available' },
        { id: '2', name: 'Test Product 2', price: 200, category: 'development', status: 'available' }
      ];

      mockCollection.mockReturnValue({ orderBy: mockOrderBy });
      mockOrderBy.mockReturnValue({ get: mockGet });
      mockGet.mockResolvedValue({
        docs: mockProducts.map(p => ({ id: p.id, data: () => p }))
      });

      const mockEvent = { url: new URL('https://example.com/api/products') } as RequestEvent;
      const response = await GET(mockEvent);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProducts);
      expect(mockCollection).toHaveBeenCalledWith('products');
      expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc');
    });

    it('should filter products by category', async () => {
      const mockProducts = [
        { id: '1', name: 'Film Product', price: 100, category: 'film', status: 'available' }
      ];

      mockCollection.mockReturnValue({ where: mockWhere });
      mockWhere.mockReturnValue({ get: mockGet });
      mockGet.mockResolvedValue({
        docs: mockProducts.map(p => ({ id: p.id, data: () => p }))
      });

      const mockEvent = { url: new URL('https://example.com/api/products?category=film') } as RequestEvent;
      const response = await GET(mockEvent);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProducts);
      expect(mockWhere).toHaveBeenCalledWith('category', '==', 'film');
    });

    it('should handle Firestore errors', async () => {
      mockCollection.mockReturnValue({ orderBy: mockOrderBy });
      mockOrderBy.mockReturnValue({ get: mockGet });
      mockGet.mockRejectedValue(new Error('Firestore error'));

      const mockEvent = { url: new URL('https://example.com/api/products') } as RequestEvent;
      const response = await GET(mockEvent);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch products' });
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product successfully', async () => {
      const productData = {
        name: 'New Product',
        price: 150,
        category: 'film',
        status: 'available',
        description: 'A new product',
        imageUrl: 'new-product.jpg',
        itemCode: 'NEW-001',
        stock: 10
      };

      const mockDocRef = { id: 'new-product-id' };
      mockCollection.mockReturnValue({ add: mockAdd });
      mockAdd.mockResolvedValue(mockDocRef);

      const mockRequest = { json: vi.fn().mockResolvedValue(productData) } as any;
      const mockEvent = { request: mockRequest } as RequestEvent;

      const response = await POST(mockEvent);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({ success: true, productId: 'new-product-id' });
      expect(mockAdd).toHaveBeenCalled();
    });

    it('should handle creation errors', async () => {
      mockCollection.mockReturnValue({ add: mockAdd });
      mockAdd.mockRejectedValue(new Error('Creation failed'));

      const mockRequest = { json: vi.fn().mockResolvedValue({}) } as any;
      const mockEvent = { request: mockRequest } as RequestEvent;

      const response = await POST(mockEvent);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to create product' });
    });
  });

  describe('PATCH /api/products', () => {
    it('should update a product successfully', async () => {
      const updateData = { productId: 'product-id', name: 'Updated Product', price: 200 };
      const mockDocRef = { update: mockUpdate };

      mockCollection.mockReturnValue({ doc: mockDoc });
      mockDoc.mockReturnValue(mockDocRef);
      mockUpdate.mockResolvedValue(undefined);

      const mockRequest = { json: vi.fn().mockResolvedValue(updateData) } as any;
      const mockEvent = { request: mockRequest } as RequestEvent;

      const response = await PATCH(mockEvent);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true, productId: 'product-id' });
    });

    it('should handle update errors', async () => {
      mockCollection.mockReturnValue({ doc: mockDoc });
      mockDoc.mockReturnValue({ update: mockUpdate });
      mockUpdate.mockRejectedValue(new Error('Update failed'));

      const mockRequest = { json: vi.fn().mockResolvedValue({ productId: 'product-id' }) } as any;
      const mockEvent = { request: mockRequest } as RequestEvent;

      const response = await PATCH(mockEvent);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to update product' });
    });

    it('should require product ID for updates', async () => {
      const mockRequest = { json: vi.fn().mockResolvedValue({ name: 'Updated Product' }) } as any;
      const mockEvent = { request: mockRequest } as RequestEvent;

      const response = await PATCH(mockEvent);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Product ID is required' });
    });
  });
});
