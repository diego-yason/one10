import { adminDb } from '$lib/server/firebase';
import type { FirebaseProduct } from '$types/firebase/Products';
import type { PageServerLoad } from './$types';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const load: PageServerLoad = async () => {
	const products = (
		(await adminDb.collection('products').get()).docs as QueryDocumentSnapshot<FirebaseProduct>[]
	).map((doc) => ({
		...doc.data(),
		createdAt: doc.data().createdAt.seconds,
		updatedAt: doc.data().updatedAt.seconds,
		id: doc.id
	}));

	// Convert to FirebaseProduct type
	return { products };
};
