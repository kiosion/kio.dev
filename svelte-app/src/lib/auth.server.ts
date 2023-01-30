import { SELF_BASE_URL } from '$lib/env';
import {
  GITHUB_APPLICATION_ID,
  GITHUB_APPLICATION_SECRET,
  GITHUB_OAUTH_BASE_URL,
  GITHUB_OAUTH_ACCESS_TOKEN_EXCHANGE_URL,
  JWT_SECRET
} from '$lib/env.server';
import {
  type APP_LANGS,
  AVAILABLE_OAUTH_PROVIDERS,
  OAUTH_COOKIE_TTL_DAYS
} from '$lib/consts';
import JWT from 'jsonwebtoken';
import type { RouteFetch } from '$types';
import type { Cookies } from '@sveltejs/kit';

const getRedirectURI = (
  provider: (typeof AVAILABLE_OAUTH_PROVIDERS)[number],
  lang?: (typeof APP_LANGS)[number]
) => {
  switch (provider) {
    case 'github': {
      return `${SELF_BASE_URL}/${
        lang ? `${lang}/` : ''
      }auth/login/oauth_callback/github`;
    }
  }
};

/**
 * Generate a new Github OAuth login URL
 * @param state An unguessable random string. Used to protect against CSRF attacks.
 */
export const generateOAuthUrl = (
  provider: (typeof AVAILABLE_OAUTH_PROVIDERS)[number],
  state: string,
  lang?: (typeof APP_LANGS)[number]
) => {
  switch (provider) {
    case 'github': {
      const CLIENT_ID = GITHUB_APPLICATION_ID;

      const url = new URL(GITHUB_OAUTH_BASE_URL);
      url.searchParams.set('client_id', CLIENT_ID);
      url.searchParams.set('redirect_uri', getRedirectURI('github', lang));
      url.searchParams.set('scope', 'user:read');
      url.searchParams.set('state', state);

      return url.toString();
    }
  }
};

/**
 * Get an access token from Github given a temporary OAuth code
 * @param code The temporary OAuth code to POST
 * @param routeFetch The fetch function to use, provided from a route load function
 * @returns `access_token`, `scope`, and `token_type` in `Record<string, string>` form
 * @throws Error if the POST request fails or the response is not ok
 */
export const exchangeGithubAccessToken = async (
  code: string,
  routeFetch: RouteFetch,
  lang?: (typeof APP_LANGS)[number]
) => {
  const CLIENT_ID = GITHUB_APPLICATION_ID;

  const url = new URL(GITHUB_OAUTH_ACCESS_TOKEN_EXCHANGE_URL);

  const body = new URLSearchParams();
  body.set('client_id', CLIENT_ID);
  body.set('client_secret', GITHUB_APPLICATION_SECRET);
  body.set('code', code);
  body.set('redirect_uri', getRedirectURI('github', lang));

  const headers = {
    Accept: 'application/json'
  };

  const response = await routeFetch(url.toString(), {
    method: 'POST',
    headers,
    body
  });

  if (response.ok) {
    const json = await response.json();
    return json;
  }

  throw new Error('Failed to exchange access token');
};

/**
 * Save Github access token into a JWT cookie
 * @param access_token The access token to save
 * @param token_type The token type to save
 * @returns A JWT cookie
 * @throws Error if the JWT secret is not set
 */
export const saveAccessTokenToJWT = (
  access_token: string,
  token_type: string
) => {
  // Return a JWT string that includes the access token and token type, and expires in 3 days
  const data = { access_token, token_type };
  const jwt = JWT.sign(data, JWT_SECRET, { expiresIn: OAUTH_COOKIE_TTL_DAYS });

  return jwt;
};

/**
 * Get Github access token and token type from a JWT cookie
 * @param jwt The JWT cookie to get the access token and token type from
 * @returns An object with `access_token` and `token_type`
 * @throws Error if the JWT secret is not set
 */
export const getAccessTokenFromJWT = (jwt: string) => {
  const payload = JWT.verify(jwt, JWT_SECRET);

  if (typeof payload !== 'object') {
    throw new Error('Invalid JWT payload');
  }

  const { access_token, token_type } = payload;

  if (!access_token || !token_type) {
    throw new Error('Missing required JWT payload');
  }

  return { access_token, token_type };
};

/**
 * Check validity of a provided JWT cookie (not expired, signed with the correct secret)
 * @param jwt The JWT cookie to check
 * @returns `true` if the JWT is valid, `false` otherwise
 * @throws Error if the JWT secret is not set
 */
export const checkJWTValidity = (jwt?: string, provider?: string) => {
  if (!(jwt && provider)) {
    return false;
  } else if (!AVAILABLE_OAUTH_PROVIDERS.some((p) => p === provider)) {
    return false;
  }

  try {
    const payload = JWT.verify(jwt, JWT_SECRET);

    if (typeof payload !== 'object') {
      return false;
    }

    const { access_token, token_type } = payload;

    if (!access_token || !token_type) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Get oauth-related cookies from a header or document.cookie string
 * @param header The header string to get cookies from
 * @returns An object with `*_oauth_token` cookies decoded, as a `Record<string, string>` object
 * @throws Error if the JWT secret is not set
 */
export const getOauthCookiesFromHeader = (header: string) => {
  const cookies = header.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const oauthCookies: Record<string, string> = {};

  for (const [key, value] of Object.entries(cookies)) {
    if (key.endsWith('_oauth_token')) {
      oauthCookies[key] = value;
    }
  }

  return oauthCookies;
};
