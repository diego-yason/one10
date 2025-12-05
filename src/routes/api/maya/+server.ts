import { json } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const payload = await request.json();
        const { id, status, requestReferenceNumber } = payload;

        if (status === 'PAYMENT_SUCCESS' || status === 'PAYMENT_SUCCESSFUL') {
            const orderQuery = await adminDb.collection('orders').where('id', '==', requestReferenceNumber).get();

            if (orderQuery.empty) {
                return json({ error: 'Order not found' }, { status: 404 });
            }

            await orderQuery.docs[0].ref.update({
                status: 'paid',
                maya_paymentId: id,
                paidAt: new Date().toISOString()
            });
        }

        return json({ status: 'ok' });

    } catch (err) {
        console.error('Webhook Error', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
};
