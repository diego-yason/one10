import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// CartService for user cart storage in Firestore
export class CartService {
	private static instance: CartService;
	private constructor() {}

	static getInstance(): CartService {
		if (!CartService.instance) {
			CartService.instance = new CartService();
		}
		return CartService.instance;
	}

	async getCart(userId: string): Promise<any[]> {
		const docRef = doc(db, 'carts', userId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return docSnap.data().items || [];
		}
		return [];
	}

	async setCart(userId: string, items: any[]): Promise<void> {
		const docRef = doc(db, 'carts', userId);
		await setDoc(docRef, { items }, { merge: true });
	}

	async clearCart(userId: string): Promise<void> {
		const docRef = doc(db, 'carts', userId);
		await setDoc(docRef, { items: [] }, { merge: true });
	}
}
