import type { PageServerLoad } from './$types';
import { checkJWTValidity, generateOAuthUrl } from '$lib/auth.server';
import {
  APP_LANGS,
  AVAILABLE_OAUTH_PROVIDERS,
  GH_OAUTH_COOKIE_NAME,
  OAUTH_REDIRECT_COOKIE_NAME
} from '$lib/consts';
import crypto from 'crypto';

export const load: PageServerLoad = ({ cookies, params, url }) => {
  const { lang } = params;
  const { searchParams } = url;

  const redirect = searchParams.get('redirect') || '/';

  cookies.set(OAUTH_REDIRECT_COOKIE_NAME, redirect, {
    path: '/',
    sameSite: 'strict',
    secure: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  });

  const authCookie = cookies.get(GH_OAUTH_COOKIE_NAME);

  const providers = AVAILABLE_OAUTH_PROVIDERS.map((provider) => {
    const state = crypto.randomBytes(16).toString('hex');

    return {
      name: provider,
      url: generateOAuthUrl(
        provider,
        state,
        lang as (typeof APP_LANGS)[number] | undefined
      )
    };
  });

  if (authCookie) {
    const isValid = checkJWTValidity(authCookie, 'github');

    if (isValid) {
      return {
        mode: 'authed' as const,
        redirect,
        providers: null
      };
    }
  }

  return {
    mode: 'unauthed' as const,
    redirect,
    providers
  };
};
