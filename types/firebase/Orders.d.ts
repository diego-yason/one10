import { Timestamp } from 'firebase-admin/firestore';

interface Order {
	id: string;
	items: {
		itemCode: string;
		quantity: number;
		name: string;
		price: number;
		addons?: {
			name: string;
			quantity: number;
			price: number;
		}[];
		details: {
			[key: string]: unknown;
		};
		notes: string;
	}[];
	grandTotal: number;
	address: {
		line1: string;
		line2?: string;
		city: string;
		province: string;
		postalCode: string;
	};
	notes: string;
	status:
		| 'pending_payment'
		| 'payment_failed'
		| 'awaiting_films'
		| 'completed'
		| 'cancelled'
		| 'refunded';
	maya_checkoutId?: string;
}
