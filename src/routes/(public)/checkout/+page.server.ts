import type { Actions } from './$types';
import { PUBLIC_MAYA_KEY } from '$env/static/public';
import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import { verifyCart } from '$lib/server/verifyCart';
import type { CartItem } from '$types/Cart';
import type { Order } from '$types/firebase/Orders';

import { checkoutSchema } from './schema';

import { adminDb } from '$lib/server/firebase';

const baseUrl = dev ? new URL('http://localhost:5173') : new URL('https://your-production-url.com');

export const actions = {
	default: async ({ fetch, request }) => {
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
			notes: 'Please deliver between 9am and 5pm.',
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
			// make checkout request
			const checkoutRes = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
				method: 'POST',
				headers: {
					Authorization: `Basic ${Buffer.from(PUBLIC_MAYA_KEY).toString('base64')}`,
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					totalAmount: {
						value: grandTotal,
						currency: 'PHP'
					},
					items,
					requestReferenceNumber: record.id,
					redirectUrl: {
						success: baseUrl + 'checkout/success',
						failure: baseUrl + 'checkout/failure',
						cancel: baseUrl + 'checkout/cancel'
					}
				}),
				signal: controller.signal
			});

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
			if (redirectUrl)
				return {
					success: true,
					redirectUrl
				};
		} catch (error) {
			// Clear any remaining timeouts
			clearTimeout(connectionTimeout);
			clearTimeout(responseTimeout);

			console.error('Checkout error:', error);

			if (error instanceof Error && error.name === 'AbortError') {
				return fail(503, {
					message: 'Request timed out. Please try again later.'
				});
			}
			return fail(500, {
				message: 'An error occurred while processing your request. Please try again later.'
			});
		}

		return fail(500);
	}
} satisfies Actions;
