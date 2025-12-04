import { adminDb } from '$lib/server/firebase';
import type { FirebaseProduct } from '$types/firebase/Products';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = (
		(await adminDb.collection('products').get()).docs as QueryDocumentSnapshot<FirebaseProduct>[]
	).map((doc) => ({
		...doc.data(),
		createdAt: doc.data().createdAt?.seconds ?? 0,
		updatedAt: doc.data().updatedAt?.seconds ?? 0,
		id: doc.id
	}));

	// Convert to FirebaseProduct type
	return { products };
};
