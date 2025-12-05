import { Buffer } from 'node:buffer';
import type { Actions } from './$types';
import { PUBLIC_MAYA_KEY, PUBLIC_BASE_URL, PUBLIC_MAYA_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import { verifyCart } from '$lib/server/verifyCart';
import type { CartItem } from '$types/Cart';
import type { Order } from '$types/firebase/Orders';

import { checkoutSchema } from './schema';

import { adminDb } from '$lib/server/firebase';

const getAuthHeader = () => `Basic ${Buffer.from(`${PUBLIC_MAYA_KEY}:`).toString('base64')}`;

export const actions = {
	create: async ({ fetch, request }) => {
		const formData = await request.formData();

		// validate user data
		const {
			success,
			data: userData,
			error
		} = checkoutSchema.safeParse({
			address: formData.get('address'),
			city: formData.get('city'),
			email: formData.get('email'),
			fullName: formData.get('fullName'),
			province: formData.get('province'),
			phone: formData.get('phone'),
			zip: formData.get('zip')
		});
		if (!success) {
			const issues = Object.fromEntries(
				error.issues.map((issue) => [issue.path.join('.'), issue.message])
			);
			return fail(400, { error: true, issues });
		}
		const data = JSON.parse(formData.get('cart') as string) as CartItem[];

		// verify
		console.log('calling verify cart');
		const isCartValid = await verifyCart(data);
		if (!isCartValid) return redirect(303, '/cart?invalid-cart');

		let grandTotal = 0;
		// process cart
		const items = data.map(({ name, price, addons, id, quantity, details }) => {
			// add up addons
			const total = addons?.reduce((sum, addon) => sum + (addon?.price ?? 0), price) ?? price;
			grandTotal += total * quantity;
			return {
				name,
				code: id,
				quantity,
				amount: {
					value: total
				},
				totalAmount: {
					value: total * quantity
				},
				addons,
				details
			};
		});

		// create order
		const order: Order = {
			id: 'order_' + Date.now(),
			items: items.map((item) => ({
				itemCode: item.code,
				quantity: item.quantity,
				name: item.name,
				price: item.amount.value,
				addons: item.addons ?? [],
				details: item.details ?? {},
				notes: ''
			})),
			grandTotal,
			address: {
				address: userData.address,
				city: userData.city,
				province: userData.province,
				postalCode: userData.zip
			},
			notes: '',
			status: 'payment_pending',
			name: userData.fullName,
			email: userData.email,
			phone: userData.phone
		};

		const record = await adminDb.collection('orders').add(order);

		// Create timeout controller for connection and response timeouts
		const controller = new AbortController();
		const connectionTimeout = setTimeout(() => {
			controller.abort();
		}, 10000); // 10s connection timeout as per Maya guidelines

		const responseTimeout = setTimeout(() => {
			controller.abort();
		}, 60000); // 60s response timeout as per Maya guidelines

		try {
			const checkoutRes = await fetch(`${PUBLIC_MAYA_URL}/checkout/v1/checkouts`, {
				method: 'POST',
				headers: {
					Authorization: getAuthHeader(),
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					totalAmount: {
						value: grandTotal,
						currency: 'PHP'
					},
					items: items.map(({ name, quantity, code, amount, totalAmount }) => ({
						name,
						quantity,
						code,
						amount,
						totalAmount
					})),
					requestReferenceNumber: record.id,
					redirectUrl: {
						success: PUBLIC_BASE_URL + '/checkout/success?order=' + record.id,
						failure: PUBLIC_BASE_URL + '/checkout/failed?order=' + record.id,
						cancel: PUBLIC_BASE_URL + '/checkout/failed?order=' + record.id
					}
				}),
				signal: controller.signal
			});
			console.log(checkoutRes);
			// Clear connection timeout once response starts
			clearTimeout(connectionTimeout);

			// eslint-disable-next-line no-var
			var {
				checkoutId,
				redirectUrl
			}: {
				checkoutId: string;
				redirectUrl: string;
			} = await checkoutRes.json();
			// Clear response timeout on success
			clearTimeout(responseTimeout);

			console.log('Successfully created checkout:', checkoutId);
			if (redirectUrl) {
				// update order with checkoutId
				await adminDb.collection('orders').doc(record.id).update({
					maya_checkoutId: checkoutId
				});

				// update product quantities
				await Promise.all(
					items.map(async (item) => {
						if (item.code == 'printing' || item.code.startsWith('dev-')) return; // skip printing items

						const productDoc = await adminDb
							.collection('products')
							.where('itemCode', '==', item.code)
							.get();
						console.log(item.code);
						await productDoc.docs[0].ref.update({
							stock: (productDoc.docs[0].data().stock ?? 0) - item.quantity
						});
					})
				);

				return {
					success: true,
					redirectUrl
				};
			}
		} catch (error) {
			// Clear any remaining timeouts
			clearTimeout(connectionTimeout);
			clearTimeout(responseTimeout);

			console.error('Checkout error:', error);
			return fail(500, { message: 'An internal error occurred.' });
		}
		return fail(500);
	},

	getPayment: async ({ fetch, request }) => {
		const formData = await request.formData();
		const orderId = formData.get('orderId') as string;

		if (!orderId) return fail(400, { error: 'Order ID is required' });

		const orderDoc = await adminDb.collection('orders').where('id', '==', orderId).get();
		if (orderDoc.empty) return fail(404, { error: 'Order not found' });

		const orderData = orderDoc.docs[0].data() as Order;

		if (orderData.status === 'paid' || orderData.status === 'payment_success') {
			return fail(400, { error: 'Order already paid' });
		}

		const mayaCheckoutRes = await fetch(`${PUBLIC_MAYA_URL}/checkout/v1/checkouts`, {
			method: 'POST',
			headers: {
				Authorization: getAuthHeader(),
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				totalAmount: {
					value: orderData.grandTotal,
					currency: 'PHP'
				},
				items: orderData.items,
				requestReferenceNumber: orderData.id,
				redirectUrl: {
					success: `${PUBLIC_BASE_URL}/checkout/success?orderId=${orderData.id}`,
					failure: `${PUBLIC_BASE_URL}/checkout/failed?orderId=${orderData.id}`,
					cancel: `${PUBLIC_BASE_URL}/checkout/failed?orderId=${orderData.id}`
				}
			})
		});

		if (!mayaCheckoutRes.ok) {
			console.error('Maya re-checkout error:', await mayaCheckoutRes.text());
			return fail(500, { error: 'Failed to create payment link' });
		}

		const { checkoutId, redirectUrl } = await mayaCheckoutRes.json();

		// update order with new checkoutId
		await adminDb.collection('orders').doc(orderDoc.docs[0].id).update({
			maya_checkoutId: checkoutId,
			status: 'payment_pending'
		});

		return redirect(303, redirectUrl);
	}
} satisfies Actions;
