export interface CheckoutSuccess {
	id: string;
	items: Item[];
	requestReferenceNumber: string;
	receiptNumber: string;
	createdAt: Date;
	updatedAt: Date;
	paymentScheme: string;
	expressCheckout: boolean;
	refundedAmount: string;
	canPayPal: boolean;
	expiredAt: Date;
	status: string;
	paymentStatus: string;
	paymentDetails: PaymentDetails;
	buyer: Buyer;
	merchant: Merchant;
	totalAmount: TotalAmount;
	redirectUrl: RedirectURL;
	transactionReferenceNumber: string;
}

export interface Buyer {
	contact: Contact;
	firstName: string;
	lastName: string;
	billingAddress: IngAddress;
	shippingAddress: IngAddress;
}

export interface IngAddress {
	line1: string;
	line2: string;
	city: string;
	state: string;
	zipCode: string;
	countryCode: string;
}

export interface Contact {
	phone: string;
	email: string;
}

export interface Item {
	name: string;
	code: string;
	description: string;
	quantity: string;
	amount: TotalAmountClass;
	totalAmount: TotalAmountClass;
}

export interface TotalAmountClass {
	value: number;
}

export interface Merchant {
	currency: string;
	email: string;
	locale: string;
	homepageUrl: string;
	isEmailToMerchantEnabled: boolean;
	isEmailToBuyerEnabled: boolean;
	isPaymentFacilitator: boolean;
	isPageCustomized: boolean;
	supportedSchemes: string[];
	canPayPal: boolean;
	payPalEmail: null;
	payPalWebExperienceId: null;
	expressCheckout: boolean;
	name: string;
}

export interface PaymentDetails {
	responses: Responses;
	paymentAt: Date;
	'3ds': boolean;
}

export interface Responses {
	efs: EFS;
}

export interface EFS {
	paymentTransactionReferenceNo: string;
	status: string;
	receipt: Receipt;
	payer: Payer;
	amount: EFSAmount;
	created_at: Date;
}

export interface EFSAmount {
	total: Total;
}

export interface Total {
	currency: string;
	value: number;
}

export interface Payer {
	fundingInstrument: FundingInstrument;
}

export interface FundingInstrument {
	card: Card;
}

export interface Card {
	cardNumber: string;
	expiryMonth: number;
	expiryYear: string;
}

export interface Receipt {
	transactionId: string;
	receiptNo: string;
	approval_code: string;
	approvalCode: string;
}

export interface RedirectURL {
	success: string;
	failure: string;
	cancel: string;
}

export interface TotalAmount {
	value: string;
	currency: string;
	details: Details;
}

export interface Details {
	discount: string;
	serviceCharge: string;
	shippingFee: string;
	tax: string;
	subtotal: string;
}
