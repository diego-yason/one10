import { adminDb } from '$lib/server/firebase';
import type { Order } from '$types/firebase/Orders';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

import { MAYA_KEY } from '$env/static/private';
import { PUBLIC_MAYA_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const orderId = url.searchParams.get('order');
	if (!orderId) return redirect(303, '/');

	const orderDoc = await adminDb.collection('orders').doc(orderId).get();
	if (!orderDoc.exists) {
		console.error('Order not found', orderId);
		return redirect(303, '/');
	}

	const orderData = orderDoc.data() as Order;
	if (!orderData.maya_checkoutId) {
		console.error('No PayMaya checkout ID found for order', orderId);
		return redirect(303, '/');
	}

	const data = await (
		await fetch(`${PUBLIC_MAYA_URL}/payments/v1/payments/${orderData.maya_checkoutId}`, {
			headers: {
				Authorization: `Basic ${Buffer.from(MAYA_KEY).toString('base64')}`
			}
		})
	).json();
	console.log('Payment status:', data);
	const { status } = data;

	const doc = adminDb.collection('orders').doc(orderId);
	if (status === 'PAYMENT_SUCCESS') await doc.update({ status: 'payment_success' });
	else if (status === 'PAYMENT_FAILED') await doc.update({ status: 'payment_failed' });
	else if (status === 'PAYMENT_CANCELLED') await doc.update({ status: 'payment_cancelled' });
	else if (status === 'PAYMENT_EXPIRED') await doc.update({ status: 'payment_expired' });
	else if (status === 'PAYMENT_PENDING') await doc.update({ status: 'payment_pending' });
	else if (status === 'PENDING_TOKEN') await doc.update({ status: 'payment_pending' });

	console.log(status);
	const statusRef = {
		PAYMENT_SUCCESS: 'success',
		PAYMENT_FAILED: 'failed',
		PAYMENT_CANCELLED: 'failed',
		PAYMENT_EXPIRED: 'failed',
		PAYMENT_PENDING: 'pending',
		PENDING_TOKEN: 'pending'
	};

	return {
		status: statusRef[status as keyof typeof statusRef],
		paymentMethod: data?.fundSource?.type ?? '',
		date: data?.updatedAt ?? '',
		amount: data?.amount ?? '0'
	};
};
