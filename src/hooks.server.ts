import { adminAuth } from '$lib/server/firebase';

export async function handle({ event, resolve }) {
	// decode cookie from b64
	const session = event.cookies.get('__session');

	if (session) {
		try {
			const decoded = await adminAuth.verifySessionCookie(session, true);
			event.locals.user = decoded;
		} catch (error) {
			console.error('Error verifying session cookie:', error);
			event.locals.user = null;
		}
	} else event.locals.user = null;

	return resolve(event);
}
