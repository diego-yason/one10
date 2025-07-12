import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	let film = '';
	switch (params.film) {
		case '35mm':
			film = '35MM FILM';
			break;
		case '120mm':
			film = '120MM FILM';
			break;
		case 'disposable':
			film = 'DISPOSABLE CAMERA';
			break;
	}
	return { film };
};
