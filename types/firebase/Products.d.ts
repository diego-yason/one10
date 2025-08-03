import type { Timestamp } from 'firebase/firestore';

export interface FirebaseProduct {
	category: string;
	createdAt: Timestamp;
	description: string;
	expiryDate?: string | null;
	imageUrl: string;
	itemCode: string;
	name: string;
	price: number;
	status: 'available' | 'unavailable';
	stock: number;
	updatedAt: Timestamp;
}
