import type { Actions } from './$types';
import { PUBLIC_MAYA_KEY } from '$env/static/public';
import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import { cart, verifyCart } from '$lib/stores/cart';
import _ from 'lodash';
import type { CartItem } from '$types/Cart';
import type { Order } from '$types/firebase/Orders';

import { adminDb } from '$lib/server/firebase';

const baseUrl = dev ? new URL('http://localhost:5173') : new URL('https://your-production-url.com');

export const actions = {
	default: async ({ fetch, request }) => {
		// TODO: implement logic for dynamic checkout
		// pretend a full cart
		const formData = await request.formData();
		const data = JSON.parse(formData.get('cart') as string) as CartItem[]; // TODO: set to cart from request

		cart.set(data);
		// verify
		verifyCart();
		// cart changed, need to reconfirm
		// if (!_.isEqual(cart, data)) return redirect(303, '/cart?invalid-cart');

		let grandTotal = 0;
		// process cart
		const items = data.map(({ name, price, addons, id, quantity }) => {
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
				}
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
				addons: [],
				details: {},
				notes: ''
			})),
			grandTotal,
			address: {
				line1: '123 Main St',
				line2: 'Apt 4B',
				city: 'Metropolis',
				province: 'Gotham',
				postalCode: '12345'
			},
			notes: 'Please deliver between 9am and 5pm.',
			status: 'pending_payment'
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
		if (redirectUrl) return redirect(303, redirectUrl);
	}
} satisfies Actions;
