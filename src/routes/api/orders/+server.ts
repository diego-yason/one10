import { adminDb } from '$lib/server/firebase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const ordersCollection = adminDb.collection('orders');
		
		const status = url.searchParams.get('status');
		let snapshot;
		
		if (status) {
			snapshot = await ordersCollection.where('status', '==', status).get();
		} else {
			snapshot = await ordersCollection.get();
		}

		const orders = snapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}));

		return json(orders);
	} catch (error) {
		console.error('Error fetching orders:', error);
		return json({ error: 'Failed to fetch orders' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const orderData = await request.json();
		
		const docRef = await adminDb.collection('orders').add(orderData);
		
		return json({ success: true, orderId: docRef.id }, { status: 201 });
	} catch (error) {
		console.error('Error creating order:', error);
		return json({ error: 'Failed to create order' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	try {
		const { orderId, ...updateData } = await request.json();

		if (!orderId) {
			return json({ error: 'Order ID is required' }, { status: 400 });
		}

		const orderRef = adminDb.collection('orders').doc(orderId);
		await orderRef.update(updateData);

		return json({ success: true, orderId });
	} catch (error) {
		console.error('Error updating order:', error);
		return json({ error: 'Failed to update order' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { orderId } = await request.json();

		if (!orderId) {
			return json({ error: 'Order ID is required' }, { status: 400 });
		}

		await adminDb.collection('orders').doc(orderId).delete();

		return json({ success: true, orderId });
	} catch (error) {
		console.error('Error deleting order:', error);
		return json({ error: 'Failed to delete order' }, { status: 500 });
	}
};
