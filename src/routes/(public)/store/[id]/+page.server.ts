import { adminDb } from '$lib/server/firebase';

import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { FirebaseProduct } from '$types/firebase/Products';

export const load: PageServerLoad = async ({ params }) => {
	const result = await adminDb.collection('products').doc(params.id).get();

	if (!result.exists) throw error(404, 'Product not found');

	const product = result.data() as FirebaseProduct;

	return {
		productId: params.id,
		product: {
			...product,
			createdAt: product.createdAt.seconds,
			updatedAt: product.updatedAt.seconds
		}
	};
};
