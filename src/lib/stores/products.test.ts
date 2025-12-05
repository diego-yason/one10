import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
  products,
  loading,
  error,
  loadProducts,
  getProductsByCategory,
  getAvailableProducts
} from './products';
import type { Product } from '$types/products';

// --- Mock SvelteKit environment ---
vi.mock('$app/environment', () => ({
  browser: true
}));

// --- Mock ProductService correctly inside vi.mock factory ---
vi.mock('$lib/services/products', () => {
  const mockGetProducts = vi.fn();

  return {
    ProductService: {
      getInstance: () => ({
        getProducts: mockGetProducts
      })
    },
    __mock: { mockGetProducts } // expose for tests
  };
});

// Access the mock functions
import * as ProductModule from '$lib/services/products';
const { ProductService, __mock } = ProductModule as any;
const mockGetProducts = __mock.mockGetProducts;

// --- Tests ---
describe('Products Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    products.set([]);
    loading.set(false);
    error.set(null);
    mockGetProducts.mockReset();
  });

  describe('initial state', () => {
    it('should initialize with empty products array', () => {
      expect(get(products)).toEqual([]);
    });

    it('should initialize with loading false', () => {
      expect(get(loading)).toBe(false);
    });

    it('should initialize with no error', () => {
      expect(get(error)).toBe(null);
    });
  });

  describe('loadProducts function', () => {
    it('should load products successfully', async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Test Product 1',
          price: 100,
          category: 'film',
          status: 'available',
          description: 'Test description 1',
          imageUrl: 'test1.jpg',
          itemCode: 'TEST-001',
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Test Product 2',
          price: 200,
          category: 'development',
          status: 'available',
          description: 'Test description 2',
          imageUrl: 'test2.jpg',
          itemCode: 'TEST-002',
          stock: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockGetProducts.mockResolvedValue(mockProducts);

      await loadProducts();

      expect(get(loading)).toBe(false);
      expect(get(error)).toBe(null);
      expect(get(products)).toEqual(mockProducts);
      expect(mockGetProducts).toHaveBeenCalledOnce();
    });

    it('should handle loading state correctly', async () => {
      let resolvePromise: (value: Product[]) => void;
      const productsPromise = new Promise<Product[]>((resolve) => {
        resolvePromise = resolve;
      });

      mockGetProducts.mockReturnValue(productsPromise);

      const loadPromise = loadProducts();

      expect(get(loading)).toBe(true);
      expect(get(error)).toBe(null);

      resolvePromise!([]);
      await loadPromise;

      expect(get(loading)).toBe(false);
    });

    it('should handle errors correctly', async () => {
      const mockError = new Error('Network error');
      mockGetProducts.mockRejectedValue(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await loadProducts();

      expect(get(loading)).toBe(false);
      expect(get(error)).toBe('Failed to load products');
      expect(get(products)).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading products:', mockError);

      consoleSpy.mockRestore();
    });

    it('should clear error before loading', async () => {
      error.set('Previous error');
      mockGetProducts.mockResolvedValue([]);
      await loadProducts();
      expect(get(error)).toBe(null);
    });
  });

  describe('getProductsByCategory function', () => {
    beforeEach(() => {
      products.set([
        {
          id: '1',
          name: 'Film Product',
          price: 100,
          category: 'film',
          status: 'available',
          description: 'Film description',
          imageUrl: 'film.jpg',
          itemCode: 'FILM-001',
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Development Product',
          price: 200,
          category: 'development',
          status: 'available',
          description: 'Development description',
          imageUrl: 'dev.jpg',
          itemCode: 'DEV-001',
          stock: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Unavailable Film',
          price: 150,
          category: 'film',
          status: 'not_available',
          description: 'Unavailable film',
          imageUrl: 'unavailable.jpg',
          itemCode: 'FILM-002',
          stock: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    });

    it('should return products for specific category (case insensitive)', () => {
      const filmProducts = getProductsByCategory('film');
      expect(filmProducts).toHaveLength(1);
      expect(filmProducts[0].category).toBe('film');
      expect(filmProducts[0].status).toBe('available');
    });

    it('should return products for specific category with different case', () => {
      const filmProducts = getProductsByCategory('FILM');
      expect(filmProducts).toHaveLength(1);
      expect(filmProducts[0].category).toBe('film');
    });

    it('should only return available products', () => {
      const filmProducts = getProductsByCategory('film');
      expect(filmProducts.every((p) => p.status === 'available')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      expect(getProductsByCategory('non-existent')).toEqual([]);
    });
  });

  describe('getAvailableProducts function', () => {
    beforeEach(() => {
      products.set([
        {
          id: '1',
          name: 'Available Product 1',
          price: 100,
          category: 'film',
          status: 'available',
          description: 'Available 1',
          imageUrl: 'available1.jpg',
          itemCode: 'AVAIL-001',
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Available Product 2',
          price: 200,
          category: 'development',
          status: 'available',
          description: 'Available 2',
          imageUrl: 'available2.jpg',
          itemCode: 'AVAIL-002',
          stock: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Unavailable Product',
          price: 150,
          category: 'film',
          status: 'not_available',
          description: 'Unavailable',
          imageUrl: 'unavailable.jpg',
          itemCode: 'UNAVAIL-001',
          stock: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    });

    it('should return only available products', () => {
      const availableProducts = getAvailableProducts();
      expect(availableProducts).toHaveLength(2);
      expect(availableProducts.every((p) => p.status === 'available')).toBe(true);
    });

    it('should return empty array when no products are available', () => {
      products.update((current) =>
        current.map((p) => ({ ...p, status: 'not_available' as const }))
      );
      expect(getAvailableProducts()).toEqual([]);
    });

    it('should return empty array when products array is empty', () => {
      products.set([]);
      expect(getAvailableProducts()).toEqual([]);
    });
  });
});
