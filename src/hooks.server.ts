import { error, redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  try {
    return await resolve(event);
  } catch (e) {
    const err = e as Error;
    console.error('Server error:', err);
    
    if (err.message.includes('401')) {
      throw redirect(302, '/errors/401');
    } else if (err.message.includes('403')) {
      throw redirect(302, '/errors/403');
    } else if (err.message.includes('404')) {
      throw redirect(302, '/errors/404');
    } else if (err.message.includes('500')) {
      throw redirect(302, '/errors/500');
    } else if (err.message.includes('502')) {
      throw redirect(302, '/errors/502');
    } else if (err.message.includes('503')) {
      throw redirect(302, '/errors/503');
    } else if (err.message.includes('504')) {
      throw redirect(302, '/errors/504');
    } else {
      throw error(500, {
        message: 'An unexpected error occurred on the server'
      });
    }
  }
};
