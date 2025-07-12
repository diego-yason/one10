import { browser } from '$app/environment';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '$lib/services/firebase';
import type { CartItem } from '$types/Cart';
import { writable } from 'svelte/store';

export const cart = writable<CartItem[]>([]);
let cartSyncUnsubscribe: () => void;

onAuthStateChanged(auth, async (user) => {
	if (!user) {
		cartSyncUnsubscribe?.();
		cart.set([]);
		return;
	}

	const docRef = doc(db, 'carts', user.uid);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) cart.set(docSnap.data().items || []);
	else cart.set([]);

	cartSyncUnsubscribe = cart.subscribe((items) => {
		setDoc(docRef, { items }, { merge: true });
	});
});

if (browser) cart.subscribe((data) => localStorage.setItem('cart', JSON.stringify(data)));

export function add(item: CartItem) {
	cart.update((items) => {
		// If item with same id/type/details exists, increase quantity
		const idx = items.findIndex(
			(i) =>
				i.id === item.id &&
				i.type === item.type &&
				JSON.stringify(i.details) === JSON.stringify(item.details)
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
