export interface Product {
	id?: string;
	itemCode: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	status: 'available' | 'not_available' | 'out_of_stock';
	imageUrl?: string;
	category: string;
	expiryDate?: string | null;
	createdAt: Date;
	updatedAt: Date;
}
