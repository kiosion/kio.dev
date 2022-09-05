import { ENV } from '$lib/env';
import type { ExternalFetch, Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
  // Bypass SSR while E2E testing to allow stubbing of requests
  if (ENV === 'testing') {
    if (
      event.url.pathname.startsWith('/blog') ||
      event.url.pathname.startsWith('/work') ||
      event.url.pathname.startsWith('/about')
    ) {
      return await resolve(event, { ssr: false });
    }
  }

  const response = await resolve(event);
  return response;
};

export const externalFetch: ExternalFetch = async (
  request
): Promise<Response> => {
  return fetch(request);
};
