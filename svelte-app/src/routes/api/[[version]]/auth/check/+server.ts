import { checkJWTValidity, getOauthCookiesFromHeader } from '$lib/auth.server';
import { GH_OAUTH_COOKIE_NAME } from '$lib/consts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { headers } = request;
  const cookies = getOauthCookiesFromHeader(headers.get('cookie') || '');

  if (cookies[GH_OAUTH_COOKIE_NAME]) {
    const valid = checkJWTValidity(cookies[GH_OAUTH_COOKIE_NAME], 'github');

    if (valid) {
      return new Response(
        JSON.stringify({
          code: 200,
          message: 'Success',
          data: {
            valid: true
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }

  return new Response(
    JSON.stringify({
      code: 400,
      message: 'Invalid request',
      detail: 'Missing or invalid JWT payload'
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
