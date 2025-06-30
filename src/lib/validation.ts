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

// Type helpers
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetFormData = z.infer<typeof resetSchema>; 