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

	// calculate steps

	const stepCount = 5; // Total steps in the tracking process
	const stepRef: Record<typeof orderData.status, string> = {
		payment_failed: 'Payment Failed',
		payment_pending: 'Awaiting Payment',
		dispatched: 'Shipped',
		completed: 'Completed',
		payment_cancelled: 'Payment Cancelled',
		payment_expired: 'Payment Expired',
		payment_success: 'Payment Successful',
		processing_awaiting_items: 'Awaiting Items',
		processing_studio: 'Processing at the Studio',
		ready_pickup: 'Ready for Pickup',
		refunded: 'Refunded'
	};
	const step = stepRef[status] || 'Unknown Status';

	const steps = [
		[stepRef.payment_pending],
		[
			stepRef.payment_success,
			stepRef.payment_failed,
			stepRef.payment_cancelled,
			stepRef.payment_expired
		],
		[stepRef.processing_awaiting_items],
		[stepRef.processing_studio],
		[stepRef.dispatched, stepRef.ready_pickup],
		[stepRef.completed, stepRef.refunded]
	];

	// filter out steps that are not applicable based on the contents
	// service-only steps
	if (!orderData.items.some((item) => item.itemCode.startsWith('dev-'))) steps.splice(2, 2); // remove processing steps if no items are service-only

	const currentStep = steps.findIndex((stepGroup) => stepGroup.includes(step)) + 1;

	return {
		id,
		items,
		grandTotal,
		status,
		notes,
		stepCount,
		currentStep,
		step
	};
};
