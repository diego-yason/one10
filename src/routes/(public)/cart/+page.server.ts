import type { Actions } from './$types';
import { PUBLIC_MAYA_KEY } from '$env/static/public';
import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';

const baseUrl = dev ? new URL('http://localhost:5173') : new URL('https://your-production-url.com');

export const actions = {
	checkout: async ({ fetch }) => {
		// TODO: implement logic for dynamic checkout

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
						value: 350 + 600,
						currency: 'PHP'
					},
					items: [
						{
							name: 'Film Development+Scanning',
							quantity: 1,
							code: 'FILM_DEV_SCN',
							totalAmount: {
								value: 350
							}
						},
						{
							name: 'Kodak Gold',
							quantity: 3,
							code: 'FILM_DEV_SCN',
							amount: {
								value: 200
							},
							totalAmount: {
								value: 600
							}
						}
					],
					requestReferenceNumber: '1234',
					redirectUrl: {
						success: baseUrl + '/cart/success',
						failure: baseUrl + '/cart/failure',
						cancel: baseUrl + '/cart/cancel'
					}
				}),
				signal: controller.signal
			});

			// Clear connection timeout once response starts
			clearTimeout(connectionTimeout);

			const {
				checkoutId,
				redirectUrl
			}: {
				checkoutId: string;
				redirectUrl: string;
			} = await checkoutRes.json();
			// Clear response timeout on success
			clearTimeout(responseTimeout);

			throw redirect(303, redirectUrl);
		} catch (error) {
			// Clear any remaining timeouts
			clearTimeout(connectionTimeout);
			clearTimeout(responseTimeout);

			if (error instanceof Error && error.name === 'AbortError') {
				throw fail(503, {
					message: 'Request timed out. Please try again later.'
				});
			}
			throw fail(500, {
				message: 'An error occurred while processing your request. Please try again later.'
			});
		}
	}
} satisfies Actions;
