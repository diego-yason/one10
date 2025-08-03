import { adminDb } from '$lib/server/firebase';
import type { QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import type { PageServerLoad } from './$types';
import type { Order } from '$types/firebase/Orders';

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
