export interface CartItem {
	details: string | null;
	id: string;
	imageUrl: string;
	name: string;
	price: number;
	quantity: number;
	type: 'product' | 'service';
}
