import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductService } from './products';
import type { Product } from '$types/products';

// Mock Firestore and Storage before importing ProductService
vi.mock('firebase/firestore', () => {
	const mockAddDoc = vi.fn();
	const mockCollection = vi.fn();
	const mockQuery = vi.fn();
	const mockOrderBy = vi.fn();
	const mockGetDocs = vi.fn();
	const mockDoc = vi.fn();
	const mockGetDoc = vi.fn();
	const mockUpdateDoc = vi.fn();
	const mockDeleteDoc = vi.fn();

	return {
		addDoc: mockAddDoc,
		collection: mockCollection,
		query: mockQuery,
		orderBy: mockOrderBy,
		getDocs: mockGetDocs,
		doc: mockDoc,
		getDoc: mockGetDoc,
		updateDoc: mockUpdateDoc,
		deleteDoc: mockDeleteDoc,
		__mocks__: {
			mockAddDoc,
			mockCollection,
			mockQuery,
			mockOrderBy,
			mockGetDocs,
			mockDoc,
			mockGetDoc,
			mockUpdateDoc,
			mockDeleteDoc
		}
	};
});

vi.mock('firebase/storage', () => {
	const mockRef = vi.fn();
	const mockUploadBytes = vi.fn();
	const mockGetDownloadURL = vi.fn();
	const mockDeleteObject = vi.fn();

	return {
		ref: mockRef,
		uploadBytes: mockUploadBytes,
		getDownloadURL: mockGetDownloadURL,
		deleteObject: mockDeleteObject,
		__mocks__: { mockRef, mockUploadBytes, mockGetDownloadURL, mockDeleteObject }
	};
});

vi.mock('./firebase', () => ({
	FirebaseService: {
		getInstance: vi.fn(() => ({
			getDbInstance: vi.fn(() => ({})),
			getStorageInstance: vi.fn(() => ({}))
		}))
	}
}));

// 🧩 Get the mocks *after* vi.mock has been evaluated
const { __mocks__: firestoreMocks } = await import('firebase/firestore');
const { __mocks__: storageMocks } = await import('firebase/storage');

const {
	mockAddDoc,
	mockCollection,
	mockQuery,
	mockOrderBy,
	mockGetDocs,
	mockDoc,
	mockGetDoc,
	mockUpdateDoc,
	mockDeleteDoc
} = firestoreMocks;

const { mockRef, mockUploadBytes, mockGetDownloadURL, mockDeleteObject } = storageMocks;

describe('ProductService', () => {
	let productService: ProductService;

	beforeEach(() => {
		vi.clearAllMocks();
		productService = ProductService.getInstance();
	});

	describe('getInstance', () => {
		it('returns singleton instance', () => {
			const instance1 = ProductService.getInstance();
			const instance2 = ProductService.getInstance();
			expect(instance1).toBe(instance2);
		});
	});

	describe('addProduct', () => {
		it('adds a new product successfully', async () => {
			const productData = {
				name: 'Test Product',
				price: 100,
				category: 'film',
				status: 'available' as const,
				description: 'Test description',
				imageUrl: 'test.jpg',
				itemCode: 'TEST-001',
				stock: 10
			};
			const mockDocRef = { id: 'new-product-id' };
			mockAddDoc.mockResolvedValue(mockDocRef);

			const result = await productService.addProduct(productData);

			expect(result).toBe('new-product-id');
			expect(mockAddDoc).toHaveBeenCalled();
		});

		it('handles add product errors', async () => {
			mockAddDoc.mockRejectedValue(new Error('Firestore error'));
			await expect(
				productService.addProduct({
					name: 'Error Product',
					price: 50,
					category: 'film',
					status: 'available',
					description: '',
					imageUrl: '',
					itemCode: 'ERR-01',
					stock: 1
				})
			).rejects.toThrow('Firestore error');
		});
	});

	describe('getProducts', () => {
		it('retrieves all products', async () => {
			const mockProducts = [
				{ id: '1', name: 'Product 1', price: 100, createdAt: new Date(), updatedAt: new Date() },
				{ id: '2', name: 'Product 2', price: 200, createdAt: new Date(), updatedAt: new Date() }
			];

			mockCollection.mockReturnValue('products-collection');
			mockQuery.mockReturnValue('query-object');
			mockOrderBy.mockReturnValue('order-by-object');
			mockGetDocs.mockResolvedValue({
				docs: mockProducts.map((p) => ({ id: p.id, data: () => p }))
			});

			const result = await productService.getProducts();
			expect(result).toEqual(mockProducts);
		});
	});

	describe('getProduct', () => {
		it('retrieves a product by ID', async () => {
			const mockProduct = { id: '1', name: 'Test Product', price: 100 };
			mockDoc.mockReturnValue('product-doc');
			mockGetDoc.mockResolvedValue({ exists: () => true, data: () => mockProduct });

			const result = await productService.getProduct('1');
			expect(result).toEqual({ id: '1', ...mockProduct });
		});

		it('returns null for non-existent product', async () => {
			mockGetDoc.mockResolvedValue({ exists: () => false });
			const result = await productService.getProduct('nonexistent');
			expect(result).toBeNull();
		});
	});

	describe('updateProduct', () => {
		it('updates a product successfully', async () => {
			mockDoc.mockReturnValue('product-doc');
			await productService.updateProduct('1', { name: 'Updated Product' });
			expect(mockUpdateDoc).toHaveBeenCalled();
		});
	});

	describe('deleteProduct', () => {
		it('deletes a product successfully', async () => {
			mockDoc.mockReturnValue('product-doc');
			await productService.deleteProduct('1');
			expect(mockDeleteDoc).toHaveBeenCalledWith('product-doc');
		});
	});

	describe('uploadProductImage', () => {
		it('uploads product image successfully', async () => {
			const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
			const mockDownloadURL = 'https://storage.googleapis.com/test.jpg';

			mockRef.mockReturnValue('storage-ref');
			mockUploadBytes.mockResolvedValue({ ref: 'storage-ref' });
			mockGetDownloadURL.mockResolvedValue(mockDownloadURL);

			const result = await productService.uploadProductImage(mockFile, 'pid');
			expect(result).toBe(mockDownloadURL);
		});
	});

	describe('deleteProductImage', () => {
		it('deletes product image successfully', async () => {
			mockRef.mockReturnValue('storage-ref');
			await productService.deleteProductImage('some-url');
			expect(mockDeleteObject).toHaveBeenCalledWith('storage-ref');
		});
	});
});
