import type { PageLoad } from './$types';

export const load: PageLoad = async ({ depends }) => {
	depends('auth:user');
};
