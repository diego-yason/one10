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
	fundSource: FundSourceCard | FundSourceQRPH;
	receipt: Receipt;
	metadata: Record<string, unknown>;
	approvalCode: string;
	receiptNumber: string;
	requestReferenceNumber: string;
}

export interface FundSourceCard {
	type: string;
	id: null;
	description: string;
	details: DetailsCard;
}

export interface DetailsCard {
	scheme: string;
	last4: string;
	first6: string;
	masked: string;
	issuer: string;
}

export interface FundSourceQRPH {
	id: string;
	type: string;
	description: string;
	details: DetailsQRPH;
}

export interface DetailsQRPH {
	mid: string;
	acquirementId: string;
	merchantTransId: string;
	transactionId: string;
	checkoutUrl: string;
	subMerchantId: string;
	subMerchantName: string;
	buyerUserId: string;
}

export interface Receipt {
	transactionId: string;
	receiptNo: string;
	approval_code: string;
	approvalCode: string;
}
