import { filmOrderSchema, addonNames } from './schema';
import { fail } from '@sveltejs/kit';
import type { z } from 'zod';
import type { CartItem } from '$types/Cart';
import { process, pushProcess, scan } from '$lib/references/filmDevPrices.json';

export const actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();

		const raw = {
			id: formData.get('id'),
			quantity: parseInt(formData.get('quantity') as string),
			notes: formData.get('notes'),
			details: {
				brand: formData.get('filmBrand'),
				process: formData.get('processType'),
				receiptMethod: formData.get('returningNegatives')
			},
			addons: [] as unknown[]
		};

		if (formData.get('scanOption') == 'scan') {
			raw.addons.push({
				id: 'scan'
			});
		}

		if (formData.get('pushProcessing')) {
			raw.addons.push({
				id: 'pushProcessing',
				quantity: parseInt(formData.get('pushProcessing') as string)
			});
		}

		console.log('Form Data:', raw);

		const { success, data, error } = filmOrderSchema.safeParse(raw);
		if (!success) {
			// convert issues to an object
			const issues = Object.fromEntries(
				error.issues.map((issue) => [issue.path.join('.'), issue.message])
			);

			console.log(issues);

			return fail(400, { error: true, issues });
		}

		// convert data to CartItem format
		const cartItem: CartItem = {
			id: data.id,
			quantity: data.quantity,
			notes: data.notes ?? '',
			details: data.details,
			imageUrl: `https://placehold.co/350x250`,
			name: `Film Development (${params.film}): ${data.details.brand}`,
			price: process[data.details.process] ?? 0,
			addons:
				data.addons?.map((addon) => {
					let price: number;
					if (addon.id === 'scan') price = scan[data.details.process] ?? 0;
					else if (addon.id === 'pushProcessing') price = pushProcess[addon.quantity!] ?? 0;
					else price = process[data.details.process] ?? 0;

					return {
						id: addon.id,
						quantity: addon.quantity ?? 1,
						name: addonNames[addon.id] ?? 'Unknown Addon',
						price
					};
				}) ?? []
		};

		return { success, item: cartItem };
	}
};
