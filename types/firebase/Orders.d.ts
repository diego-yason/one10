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
		| 'payment_pending'
		| 'payment_success'
		| 'payment_failed'
		| 'payment_cancelled'
		| 'payment_expired'
		| 'processing_awaiting_items'
		| 'processing_studio'
		| 'ready_pickup'
		| 'dispatched'
		| 'completed'
		| 'refunded';
	maya_checkoutId?: string;
	name: string;
	email: string;
	phone: string;
}
