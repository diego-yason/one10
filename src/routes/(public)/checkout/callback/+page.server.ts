import { adminDb } from '$lib/server/firebase';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const orderId = url.searchParams.get('order');
	if (!orderId) return redirect(303, '/');

	const { status } = await (
		await fetch(`https://pg-sandbox.paymaya.com/payments/v1/payments/${orderId}/status`)
	).json();

	const doc = adminDb.collection('orders').doc(orderId);
	if (status === 'PAYMENT_SUCCESS') {
		await doc.update({ status: 'payment_success' });
		return redirect(303, '/checkout/success?order=' + orderId);
	} else if (status === 'PAYMENT_FAILED') await doc.update({ status: 'payment_failed' });
	else if (status === 'PAYMENT_CANCELLED') await doc.update({ status: 'payment_cancelled' });
	else if (status === 'PAYMENT_EXPIRED') await doc.update({ status: 'payment_expired' });
	else if (status === 'PAYMENT_PENDING') await doc.update({ status: 'payment_pending' });
	return redirect(303, '/');
};
