export interface Payload {
	id: string;
	isPaid: boolean;
	status: string;
	amount: string;
	currency: string;
	canVoid: boolean;
	canRefund: boolean;
	canCapture: boolean;
	createdAt: Date;
	updatedAt: Date;
	description: string;
	requestReferenceNumber: string;
}
