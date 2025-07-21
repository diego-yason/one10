export interface CartItem {
	details: {
		[key: string]: unknown;
	};
	id: string;
	/** for local reference only */
	imageUrl: string;
	/** for local reference only */
	name: string;
	/** for local reference only */
	price: number;
	quantity: number;
	notes?: string;
	addons?: {
		id: string;
		quantity: number;
		/** for local reference only */
		name: string;
		/** for local reference only */
		price: number;
	}[];
}
