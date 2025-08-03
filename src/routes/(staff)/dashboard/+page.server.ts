import type { PageServerLoad } from './$types';

import { admin, adminDb } from '$lib/server/firebase';

export const load: PageServerLoad = async () => {
	const ordersCollection = adminDb.collection('orders');

	const pendingArray = ['payment_pending', 'processing_awaiting_items'];
	const paidArray = ['payment_success', 'processing_studio'];
	const completedArray = ['dispatched', 'ready_pickup', 'completed'];
	const failedArray = ['payment_failed', 'payment_cancelled', 'payment_expired', 'refunded'];

	const getCount = (status: string) => ordersCollection.where('status', '==', status).count().get();

	const promisePending = pendingArray.map(getCount);
	const promisePaid = paidArray.map(getCount);
	const promiseCompleted = completedArray.map(getCount);
	const promiseFailed = failedArray.map(getCount);

	// @ts-expect-error firestore types are useless to properly type in this scenario
	function add(acc, data) {
		return acc + data.data().count;
	}

	return {
		// need to await to unwrap the promise
		pending: (await Promise.all(promisePending)).reduce(add, 0),
		paid: (await Promise.all(promisePaid)).reduce(add, 0),
		completed: (await Promise.all(promiseCompleted)).reduce(add, 0),
		failed: (await Promise.all(promiseFailed)).reduce(add, 0)
	};
};
