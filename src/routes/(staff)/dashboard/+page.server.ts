import type { PageServerLoad } from './$types';

import { admin, adminDb } from '$lib/server/firebase';

export const load: PageServerLoad = async () => {
	return {
		pending: 0,
		paid: 0,
		completed: 0
	};

	const ordersCollection = adminDb.collection('orders');

	const pendingArray: Promise<unknown>[] = [];
	const paidArray: Promise<unknown>[] = [];
	const completedArray: Promise<unknown>[] = [];
	pendingArray.push(ordersCollection.where('status', '==', 'pending_payment').count().get());
	pendingArray.push(ordersCollection.where('status', '==', 'awaiting_films').count().get());

	// @ts-expect-error firestore types are useless to properly type in this scenario
	function add(acc, data) {
		return acc + data.data().count;
	}

	return {
		// need to await to unwrap the promise
		pending: await pendingArray.reduce(add, 0),
		paid: await paidArray.reduce(add, 0),
		completed: await completedArray.reduce(add, 0)
	};
};
