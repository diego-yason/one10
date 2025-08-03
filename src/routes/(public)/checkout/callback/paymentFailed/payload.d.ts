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
	paymentTokenId: string;
	fundSource: FundSource;
	metadata: Record<string, unknown>;
	errorCode: string;
	errorMessage: string;
}

export interface FundSource {
	type: string;
	id: null;
	description: string;
	details: Details;
}

export interface Details {
	scheme: string;
	last4: string;
	first6: string;
	masked: string;
	issuer: string;
}
