import { adminDb } from '$lib/server/firebase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const productsCollection = adminDb.collection('products');
		
		const category = url.searchParams.get('category');
		const status = url.searchParams.get('status');
		let snapshot;
		
		if (category && category !== 'All') {
			snapshot = await productsCollection.where('category', '==', category).get();
		} else if (status) {
			snapshot = await productsCollection.where('status', '==', status).get();
		} else {
			snapshot = await productsCollection.orderBy('createdAt', 'desc').get();
		}

		const products = snapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}));

		return json(products);
	} catch (error) {
		console.error('Error fetching products:', error);
		return json({ error: 'Failed to fetch products' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const productData = await request.json();
		
		const now = new Date();
		const product = {
			...productData,
			createdAt: now,
			updatedAt: now
		};
		
		const docRef = await adminDb.collection('products').add(product);
		
		return json({ success: true, productId: docRef.id }, { status: 201 });
	} catch (error) {
		console.error('Error creating product:', error);
		return json({ error: 'Failed to create product' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	try {
		const { productId, ...updateData } = await request.json();

		if (!productId) {
			return json({ error: 'Product ID is required' }, { status: 400 });
		}

		const productRef = adminDb.collection('products').doc(productId);
		await productRef.update({
			...updateData,
			updatedAt: new Date()
		});

		return json({ success: true, productId });
	} catch (error) {
		console.error('Error updating product:', error);
		return json({ error: 'Failed to update product' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { productId } = await request.json();

		if (!productId) {
			return json({ error: 'Product ID is required' }, { status: 400 });
		}

		await adminDb.collection('products').doc(productId).delete();

		return json({ success: true, productId });
	} catch (error) {
		console.error('Error deleting product:', error);
		return json({ error: 'Failed to delete product' }, { status: 500 });
	}
};
