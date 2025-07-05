import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { auth } from '$lib/services/firebase';

const user: Handle = async ({ event, resolve }) => {
	if (!auth.currentUser) event.locals.user = { email: null, id: null };
	else {
		const { email, uid } = auth.currentUser;
		event.locals.user = {
			email,
			id: uid
		};
	}

	return resolve(event);
};

const authGuardStaff: Handle = async ({ event, resolve }) => {
	const staffRoutes = ['/dashboard', '/messages', '/orders', '/products'];
	if (staffRoutes.some((route) => event.url.pathname.startsWith(route)))
		if (!event.locals.user.email?.endsWith('@one10studiolab.com'))
			// TODO: confirm if 3XX is correct
			return redirect(307, '/');
	return resolve(event);
};

const authGuardUser: Handle = async ({ event, resolve }) => {
	// TODO: determine what public routes need protection
	const signedInRoutes = ['/profile']; // example
	const signedOutRoutes = ['/login', '/register'];

	if (signedInRoutes.some((route) => event.url.pathname.startsWith(route)))
		if (event.locals.user.id == null) return redirect(307, '/login');

	if (signedOutRoutes.some((route) => event.url.pathname.startsWith(route)))
		if (event.locals.user.id == null) return redirect(307, '/');

	return resolve(event);
};

export const handle = sequence(user, authGuardStaff, authGuardUser);
