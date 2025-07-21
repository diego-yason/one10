const PUBLIC_MAYA_KEY = 'pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF';
const amount = 1000; // sample

// make checkout request
const res = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
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
			success: 'http://localhost:5173/success',
			failure: 'http://localhost:5173/failure',
			cancel: 'http://localhost:5173/cancel'
		}
	})
});

console.log(await res.json());

export {};
