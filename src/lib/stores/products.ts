import { writable } from 'svelte/store';
import { ProductService, type Product } from '$lib/firebase';
import { browser } from '$app/environment';

export const products = writable<Product[]>([]);
export const loading = writable(false);
export const error = writable<string | null>(null);

const productService = ProductService.getInstance();

// Load products from Firebase
export async function loadProducts() {
	if (!browser) return;
	
	try {
		loading.set(true);
		error.set(null);
		const productList = await productService.getProducts();
		products.set(productList);
	} catch (err) {
		console.error('Error loading products:', err);
		error.set('Failed to load products');
	} finally {
		loading.set(false);
	}
}

// Get products by category
export function getProductsByCategory(category: string): Product[] {
	let productList: Product[] = [];
	products.subscribe(value => {
		productList = value.filter(product => 
			product.category.toLowerCase() === category.toLowerCase() && 
			product.status === 'available'
		);
	})();
	return productList;
}

// Get available products only
export function getAvailableProducts(): Product[] {
	let productList: Product[] = [];
	products.subscribe(value => {
		productList = value.filter(product => product.status === 'available');
	})();
	return productList;
}

// Initialize products on browser load
if (browser) {
	loadProducts();
} 