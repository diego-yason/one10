import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
  // Get the status code from the query parameter
  const statusCode = Number(url.searchParams.get('code')) || 404;
  
  // Throw the appropriate error based on the status code
  throw error(statusCode, {
    message: `Test error with status code ${statusCode}`
  });
};
