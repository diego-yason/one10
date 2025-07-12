export interface CartItem {
	details: {
		[key: string]: unknown;
	};
	id: string;
	imageUrl: string;
	name: string;
	price: number;
	quantity: number;
	type: 'product' | 'service';
}
