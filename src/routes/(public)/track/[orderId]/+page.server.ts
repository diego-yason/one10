import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

import { adminDb } from '$lib/server/firebase';
import type { Order } from '$types/firebase/Orders';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ params, request }) => {
	const { orderId } = params;

	const orderDoc = await adminDb.collection('orders').where('id', '==', orderId).limit(1).get();

	if (orderDoc.empty) return redirect(303, `/track?noOrder`);

	const orderData = orderDoc.docs[0].data() as Order;
	const { status, id, items, grandTotal, notes } = orderData;

	return {
		id,
		items,
		grandTotal,
		status,
		notes
	};
};
