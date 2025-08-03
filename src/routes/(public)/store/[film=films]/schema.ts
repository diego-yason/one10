import { z } from 'zod';

export const filmOrderSchema = z.object({
	id: z.string(),
	quantity: z.number().min(1),
	notes: z.string().optional().nullable(),
	addons: z
		.array(
			z.object({
				id: z.string(),
				quantity: z.number().optional()
			})
		)
		.optional(),
	details: z.object({
		brand: z.string({ message: 'Brand is required' }).min(1),
		process: z.enum(['c41', 'bw', 'ecn2'], {
			message: 'Process is required.'
		}),
		receiptMethod: z.enum(['mobile', 'traditional', 'self', 'false'])
	})
});

export const addonNames: { [key: string]: string } = {
	scan: 'Dev+Scan Promo',
	pushProcessing: 'Push Processing'
};
