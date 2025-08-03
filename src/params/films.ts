import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is 'disposable' | '120mm' | '35mm' => {
	const films = ['disposable', '120mm', '35mm'];
	return films.includes(param);
}) satisfies ParamMatcher;
