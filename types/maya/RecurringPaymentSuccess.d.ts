export interface RecurringPaymentSuccess {
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
	receipt: Receipt;
	approvalCode: string;
	receiptNumber: string;
	requestReferenceNumber: string;
}

export interface FundSource {
	type: string;
	id: string;
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

export interface Receipt {
	transactionId: string;
	receiptNo: string;
	approval_code: string;
	approvalCode: string;
}
