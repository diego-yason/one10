import type { RequestHandler } from './$types';
import type { Payload } from './payload';

import verifyAddress from '../verifyAddress.js';
import { adminDb } from '$lib/server/firebase';

import type { DocumentSnapshot } from 'firebase-admin/firestore';
import type { Order } from '$types/firebase/Orders';
/**
 * TODO:
 * 	1. verify webhook authenticity & payment success,
 * 	2. retrieve orderId, payerUid, and uploadIds (the checkout payload should have included the uploadIds in the order creation step),
 *  3. call finalizeUploadsForOrder(orderId, payerUid, uploadIds),
 *  4. update order with paymentStatus: 'paid' and prints metadata,
 *  5. optionally notify staff via your existing staff flow.
 */
export const POST = (async ({ request, getClientAddress }) => {
	if (!verifyAddress(getClientAddress())) return new Response('Unauthorized', { status: 401 });

	console.log('received payment success callback');

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
			status: 'payment_success'
		});
	})();

	return new Response('Acknowledged', { status: 200 });
}) satisfies RequestHandler;
