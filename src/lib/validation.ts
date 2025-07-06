import { z } from 'zod';

// Shared email schema with custom rule
const emailSchema = z
	.string()
	.email("Please enter a valid email address.")
	.refine(
		(val) => !val.endsWith('.'),
		{ message: "Email address cannot end with a dot." }
	);

// Stricter password schema for registration
const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters.")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter.")
	.regex(/[0-9]/, "Password must contain at least one number.")
	.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.");

// Simple password schema for login
const loginPasswordSchema = z.string().min(1, "Password is required.");

// Shared validation schemas
export const loginSchema = z.object({
	email: emailSchema,
	password: loginPasswordSchema,
});

export const registerSchema = z.object({
	firstName: z.string().min(1, "First name is required."),
	lastName: z.string().min(1, "Last name is required."),
	email: emailSchema,
	password: passwordSchema,
});

export const resetSchema = z.object({
	email: emailSchema,
});

// Firebase error message handler
export function getFirebaseErrorMessage(error: any): string {
	if (!error || typeof error.code !== 'string') return 'An unknown error occurred.';

	switch (error.code) {
		case 'auth/email-already-in-use':
			return 'This email is already registered.';
		case 'auth/invalid-email':
			return 'The email address is invalid.';
		case 'auth/user-not-found':
			return 'No account found with this email.';
		case 'auth/wrong-password':
			return 'Incorrect password.';
		case 'auth/weak-password':
			return 'Password does not meet the requirements.';
		case 'auth/popup-closed-by-user':
			return 'The sign-in popup was closed before completing the sign in.';
		case 'auth/popup-blocked':
			return 'The sign-in popup was blocked by your browser.';
		case 'auth/network-request-failed':
			return 'Network error. Please check your connection and try again.';
		default:
			return error.message || 'An unknown error occurred.';
	}
}

// Generic field validation function
export function validateField<T extends z.ZodObject<any>>(
	schema: T, 
	field: keyof z.infer<T>, 
	value: string
): string {
	const fieldSchema = schema.shape[field as keyof typeof schema.shape];
	if (!fieldSchema) return '';
	
	const result = fieldSchema.safeParse(value);
	return result.success ? '' : result.error.errors[0]?.message || '';
}

// Service form validation schemas
export const disposableSchema = z.object({
	filmBrand: z.string().min(1, "Film brand name is required."),
	processType: z.string().min(1, "Please select a process type."),
	returningNegatives: z.string().min(1, "Please select how to return negatives."),
	scanOption: z.string().min(1, "Please select a scan/process option."),
});

export const film35mmSchema = z.object({
	filmBrand: z.string().min(1, "Film brand name is required."),
	processType: z.string().min(1, "Please select a process type."),
	returningNegatives: z.string().min(1, "Please select how to return negatives."),
	scanOption: z.string().min(1, "Please select a scan/process option."),
});

export const film120mmSchema = z.object({
	filmBrand: z.string().min(1, "Film brand name is required."),
	processType: z.string().min(1, "Please select a process type."),
	returningNegatives: z.string().min(1, "Please select how to return negatives."),
	scanOption: z.string().min(1, "Please select a scan/process option."),
});

export const printingSchema = z.object({
	photoSize: z.string().min(1, "Please select a photo size."),
	totalPhotos: z.string().min(1, "Please enter the total number of photos."),
	accessPhotos: z.string().min(1, "Please select how to access your photos."),
	linkPhotos: z.string().optional(), // Optional field
	dropoffMode: z.string().min(1, "Please select a drop-off delivery mode."),
	dropoffOther: z.string().optional(),
	pickupMode: z.string().min(1, "Please select a pick-up delivery mode."),
	pickupOther: z.string().optional(),
}).superRefine((data, ctx) => {
	if (data.dropoffMode === 'other' && (!data.dropoffOther || data.dropoffOther.trim() === '')) {
		ctx.addIssue({
			path: ['dropoffOther'],
			code: z.ZodIssueCode.custom,
			message: 'Please specify the drop-off method.'
		});
	}
	if (data.pickupMode === 'other' && (!data.pickupOther || data.pickupOther.trim() === '')) {
		ctx.addIssue({
			path: ['pickupOther'],
			code: z.ZodIssueCode.custom,
			message: 'Please specify the pick-up method.'
		});
	}
});

// Type helpers
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetFormData = z.infer<typeof resetSchema>;
export type DisposableFormData = z.infer<typeof disposableSchema>;
export type Film35mmFormData = z.infer<typeof film35mmSchema>;
export type Film120mmFormData = z.infer<typeof film120mmSchema>;
export type PrintingFormData = z.infer<typeof printingSchema>; 