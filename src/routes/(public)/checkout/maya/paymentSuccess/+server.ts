import type { RequestHandler } from './$types';
import verifyAddress from '../verifyAddress.js';

export const POST = (async ({ request }) => {
	return new Response();
}) satisfies RequestHandler;

export const GET = (async ({ getClientAddress }) => {
	if (!verifyAddress(getClientAddress())) return new Response('Unauthorized', { status: 401 });

	return new Response('Maya payment success endpoint');
}) satisfies RequestHandler;
