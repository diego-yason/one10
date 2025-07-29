import { browser } from '$app/environment';
import { collection, doc, getDoc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '$lib/services/firebase';
import type { CartItem } from '$types/Cart';
import { writable } from 'svelte/store';
import _ from 'lodash';

export const cart = writable<CartItem[]>([]);

let cartStatic: CartItem[];
cart.subscribe((data) => (cartStatic = data));

let cartSyncUnsubscribe: () => void;

// onAuthStateChanged(auth, async (user) => {
// 	if (!user) {
// 		if (cartSyncUnsubscribe) {
// 			cartSyncUnsubscribe();
// 			cart.set([]);
// 		}
// 		return;
// 	}

// 	const docRef = doc(db, 'carts', user.uid);
// 	const docSnap = await getDoc(docRef);
// 	if (docSnap.exists()) cart.set(docSnap.data().items || []);
// 	else cart.set([]);

// 	cartSyncUnsubscribe = cart.subscribe((items) => {
// 		setDoc(docRef, { items }, { merge: true });
// 	});
// });

if (browser) cart.set(JSON.parse(localStorage.getItem('cart') || '[]'));
if (browser) cart.subscribe((data) => localStorage.setItem('cart', JSON.stringify(data)));

export function add(item: CartItem) {
	cart.update((items) => {
		// If item with same id/type/details exists, increase quantity
		const idx = items.findIndex(
			(i) => i.id === item.id && _.isEqual(i.details, item.details) && item.notes === i.notes
		);
		if (idx !== -1) {
			items[idx].quantity += item.quantity;
			return [...items];
		}
		const newItems = [...items, item];
		return newItems;
	});
}

export function remove(index: number) {
	cart.update((items) => {
		const newItems = items.slice();
		newItems.splice(index, 1);
		return newItems;
	});
}

export function updateQuantity(index: number, quantity: number) {
	cart.update((items) => {
		if (quantity > 0) {
			items[index] = { ...items[index], quantity };
		} else {
			items.splice(index, 1);
		}
		return items;
	});
}

export function clear() {
	cart.set([]);
}

// Toast store for global notifications
export const toast = writable<string | null>(null);
export function showToast(message: string) {
	toast.set(message);
	setTimeout(() => toast.set(null), 2000);
}

// verify with server, and ensure no items with zero quantity
export async function verifyCart() {
	return; //disable for now
	const tempCart = Object.create(cartStatic) as CartItem[];

	const promises = tempCart.map(async (item) => {
		const q = query(collection(db, 'products'), where('itemCode', '==', item.id), limit(1));
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) return null;

		const doc = querySnapshot.docs[0];
		if (!doc.exists()) {
			showToast(`Item ${item.name} is no longer available.`);
			return null;
		}

		const data = doc.data();
		if (data.quantity < item.quantity) {
			showToast(`Only ${data.quantity} of ${item.name} is available.`);
			item.quantity = data.quantity;
		}

		if (item.quantity <= 0) {
			showToast(`Item ${item.name} is no longer available.`);
			return null;
		}

		if (item.price !== data.price) {
			showToast(`Price for ${item.name} has been updated.`);
			item.price = data.price;
		}

		return item;
	});

	const newCart = (await Promise.all(promises).then((items) =>
		items.filter((item) => item !== null)
	)) as CartItem[];

	cart.set(newCart);
}
