import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const orderId = formData.get('orderId') as string;

		return redirect(302, '/track/' + orderId);
	}
};
