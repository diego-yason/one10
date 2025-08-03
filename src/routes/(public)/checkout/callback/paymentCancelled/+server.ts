import type { RequestHandler } from './$types';
import type { Payload } from './payload';

import verifyAddress from '../verifyAddress.js';
import { adminDb } from '$lib/server/firebase';

import type { DocumentSnapshot } from 'firebase-admin/firestore';
import type { Order } from '$types/firebase/Orders';

export const POST = (async ({ request, getClientAddress }) => {
	if (!verifyAddress(getClientAddress())) return new Response('Unauthorized', { status: 401 });

	const payload = (await request.json()) as Payload;

	// wrapper for async operations
	(async function () {
		// get order from database
		const query = await adminDb
			.collection('orders')
			.where('maya_checkoutId', '==', payload.id)
			.get();

		if (query.empty) {
			console.error('Order not found for checkout ID:', payload.id);
			return;
		}
		const order = query.docs[0] as DocumentSnapshot<Order>;

		if (order.data()?.status !== 'payment_pending') {
			console.error('Order is not in payment_pending status:', order.id);
			return;
		}

		// update order status
		await order.ref.update({
			status: 'payment_cancelled'
		});
	})();

	return new Response('Acknowledged', { status: 200 });
}) satisfies RequestHandler;
