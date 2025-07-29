export {};
const baseUrl = new URL('http://localhost:5173');
const PUBLIC_MAYA_KEY = 'pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF';

const controller = new AbortController();
const connectionTimeout = setTimeout(() => {
	controller.abort();
}, 10000); // 10s connection timeout as per Maya guidelines

const responseTimeout = setTimeout(() => {
	controller.abort();
}, 60000); // 60s response timeout as per Maya guidelines

const checkoutRes = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
	method: 'POST',
	headers: {
		Authorization: `Basic ${Buffer.from(`${PUBLIC_MAYA_KEY}:`).toString('base64')}`,
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

console.log(await checkoutRes.json());
