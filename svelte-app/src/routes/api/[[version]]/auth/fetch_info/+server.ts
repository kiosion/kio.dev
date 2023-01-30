import {
  checkJWTValidity,
  getOauthCookiesFromHeader,
  getAccessTokenFromJWT
} from '$lib/auth.server';
import { GH_OAUTH_COOKIE_NAME } from '$lib/consts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { headers } = request;
  const cookies = getOauthCookiesFromHeader(headers.get('cookie') || '');

  if (
    !cookies[GH_OAUTH_COOKIE_NAME] ||
    !checkJWTValidity(cookies[GH_OAUTH_COOKIE_NAME], 'github')
  ) {
    return new Response(
      JSON.stringify({
        code: 400,
        message: 'Invalid request',
        detail: 'Missing or invalid required JWT payload'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const { access_token, token_type } = getAccessTokenFromJWT(
    cookies[GH_OAUTH_COOKIE_NAME]
  );

  const url = new URL('https://api.github.com/user');
  const reqHeaders = {
    Accept: 'application/json',
    Authorization: `${token_type} ${access_token}`
  };

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: reqHeaders
  });

  if (response.ok) {
    const json = await response.json();

    const { login, name, avatar_url, html_url } = json || {};

    return new Response(
      JSON.stringify({
        code: 200,
        message: 'Success',
        data: {
          login,
          name,
          avatar_url,
          html_url
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

  return new Response(
    JSON.stringify({
      code: 400,
      message: 'Invalid request',
      detail: 'Could not fetch user info from Github API'
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
