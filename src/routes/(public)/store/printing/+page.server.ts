import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

// export const load: PageServerLoad = async () => {
// 	return error(404);
// };
export const actions = {
	default: async ({ request, params }) => {
    const formData = await request.formData();
    console.log("BABA BOEY")
    console.log(formData)
  }
}