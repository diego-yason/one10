import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	let film = '';
	switch (params.film) {
		case '35mm':
			film = '35mm Film';
			break;
		case '120mm':
			film = '120mm Film';
			break;
		case 'disposable':
			film = 'Disposable Camera';
			break;
	}
	return { film, filmCode: params.film };
};
