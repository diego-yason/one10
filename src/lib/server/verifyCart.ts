import type { CartItem } from '$types/Cart';
import { adminDb } from '$lib/server/firebase';
import { process, pushProcess, scan } from '$lib/references/filmDevPrices.json';
import _ from 'lodash';

export async function verifyCart(cart: CartItem[]): Promise<boolean> {
	// return; //disable for now
	const tempCart = Object.create(cart) as CartItem[];

	const promises = tempCart.map(async (item) => {
		// NOTE: this method of checking if it is a service is NOT compatible with printing, for future purposes.
		if (item.id.startsWith('dev-')) {
			// For services, we don't need to check availability
			if (item.quantity <= 0) {
				return null;
			}

			// check for price
			if (item.price !== process[item.details.process as keyof typeof process]) {
				item.price = process[item.details.process as keyof typeof process];
			}

			if (item.addons)
				item.addons.map((addon) => {
					let price;
					if (addon.id === 'scan') {
						price = scan[item.details.process as keyof typeof scan] ?? 0;
					} else if (addon.id === 'pushProcessing') {
						price = pushProcess[addon.quantity!] ?? 0;
					}

					if (price && addon.price !== price) {
						addon.price = price;
					}

					return addon;
				});

			return item;
		}

		const querySnapshot = await adminDb
			.collection('products')
			.where('itemCode', '==', item.id)
			.limit(1)
			.get();
		if (querySnapshot.empty) return null;

		const docSnapshot = querySnapshot.docs[0];
		if (!docSnapshot.exists) {
			return null;
		}

		const data = docSnapshot.data();
		if (data.quantity < item.quantity) {
			item.quantity = data.quantity;
		}

		if (item.quantity <= 0) {
			return null;
		}

		if (item.price !== data.price) {
			item.price = data.price;
		}

		return item;
	});

	const newCart = (await Promise.all(promises).then((items) =>
		items.filter((item) => item !== null)
	)) as CartItem[];

	console.log('Cart verified');

	return _.isEqual(cart, newCart);
}
