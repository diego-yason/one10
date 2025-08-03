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
		address: string;
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
	name: string;
	email: string;
	phone: string;
}
