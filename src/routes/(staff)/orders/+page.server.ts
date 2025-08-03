import { adminDb } from '$lib/server/firebase';
import type { QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import type { PageServerLoad } from './$types';
import type { Order } from '$types/firebase/Orders';

export const load = (async () => {
	const ordersSnap = (await adminDb.collection('orders').get()) as QuerySnapshot<DocumentData>;

	// Filter out completed orders
	const filteredOrders = ordersSnap.docs
		.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as Order)
		.filter((order: Order) => !['completed', 'refunded', 'cancelled'].includes(order.status))
		.sort((a, b) => {
			// remove order_ prefix and convert to number for comparison
			const aId = parseInt(a.id.replace('order_', ''), 10);
			const bId = parseInt(b.id.replace('order_', ''), 10);
			return bId - aId; // Sort in descending order
		})
		.sort((a, b) => {
			// sort by status in order
			// awaiting_films, pending_payment, payment_failed, cancelled, refunded
			const statusOrder = {
				awaiting_films: 1,
				pending_payment: 2,
				payment_failed: 3,
				cancelled: 4,
				refunded: 5,
				completed: 6
			};

			return statusOrder[a.status] - statusOrder[b.status];
		});

	return { orders: filteredOrders };
}) satisfies PageServerLoad;
