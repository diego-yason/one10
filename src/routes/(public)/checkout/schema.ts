import { z } from 'zod';

export const checkoutSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	fullName: z.string().min(1, { message: 'Full name is required' }),
	address: z.string().min(1, { message: 'Address is required' }),
	city: z.string().min(1, { message: 'City is required' }),
	province: z.string().min(1, { message: 'Province is required' }),
	zip: z.string().length(4, { message: 'ZIP code must be 4 digits' }),
	phone: z
		.string()
		.min(10, { message: 'Phone number must be at least 10 digits' })
		.max(11, { message: 'Phone number must be at most 11 digits' })
});
