import type { QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import type { Actions, PageServerLoad } from './$types';
import type { Order } from '$types/firebase/Orders';

import { adminDb } from '$lib/server/firebase';

export const load = (async () => {
	const ordersSnap = (await adminDb.collection('orders').get()) as QuerySnapshot<DocumentData>;

	const filteredOrders = ordersSnap.docs
		.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as Order)
		.filter((order: Order) => !['completed', 'refunded', 'cancelled'].includes(order.status))
		.sort((a, b) => {
			const aId = parseInt(a.id.replace('order_', ''), 10);
			const bId = parseInt(b.id.replace('order_', ''), 10);
			return bId - aId;
		})
		.sort((a, b) => {
			const statusOrder = {
				payment_pending: 1,
				payment_expired: 2,
				payment_failed: 3,
				payment_cancelled: 4,
				payment_success: 5,
				processing_awaiting_items: 6,
				processing_studio: 7,
				ready_pickup: 8,
				dispatched: 9,
				refunded: 10,
				completed: 11
			};

			return (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999);
		});

	return { orders: filteredOrders };
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const formData = await request.formData();

		const orderId = formData.get('orderId') as string;
		const status = formData.get('status') as string;

		const order = await adminDb.collection('orders').where('id', '==', orderId).limit(1).get();

		if (order.empty) {
			return { success: false, message: 'Order not found' };
		}

		await adminDb.collection('orders').doc(order.docs[0].id).update({ status });
		console.log(`Order ${orderId} status updated to ${status}`);
		return { success: true };
	}
};
