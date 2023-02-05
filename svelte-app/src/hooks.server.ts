import { APP_LANGS } from '$lib/consts';
import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }): Promise<Response> => {
  let response: Response;

  const lang = event.request.url.match(
    new RegExp(
      `^.*(?:(?:.[a-z]{3})|(?:[a-z]+:[0-9]{4}))/(${APP_LANGS.join('|')})/?`
    )
  );

  if (lang) {
    response = await resolve(event, {
      transformPageChunk: ({ html }) =>
        html.replace(/<html lang="en">/, `<html lang="${lang[1]}">`)
    });
  } else {
    response = await resolve(event);
  }

  return response;
}) satisfies Handle;

export const handleError = (({ error, event }) => {
  try {
    return {
      code: (error as Error & { code?: number })?.code ?? 500,
      message: (error as Error)?.message ?? 'An unknown error occurred'
    };
  } catch {
    return {
      status: 500,
      message: 'Internal server error'
    };
  }
}) satisfies HandleServerError;
