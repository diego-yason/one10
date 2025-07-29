import type { Timestamp } from 'firebase/firestore';

export interface FirebaseService {
	createdAt: Timestamp;
	imageUrl: string;
	itemCode: string;
	name: string;
	price: { [key: string]: number };
	addon: {
		[key: string]: {
			name: string;
			price: { [key: string]: number };
		};
	};
	status: 'available' | 'unavailable'; // should always be available though
	updatedAt: Timestamp;
}
