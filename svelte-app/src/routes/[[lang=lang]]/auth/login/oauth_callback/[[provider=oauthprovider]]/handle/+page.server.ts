import {
  exchangeGithubAccessToken,
  saveAccessTokenToJWT
} from '$lib/auth.server';
import {
  type APP_LANGS,
  OAUTH_COOKIE_TTL_S,
  GH_OAUTH_COOKIE_NAME,
  OAUTH_REDIRECT_COOKIE_NAME
} from '$lib/consts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, params, url }) => {
  const { searchParams } = url;
  const { provider, lang } = params;
  const code = searchParams.get('code');
  const redirect = cookies.get(OAUTH_REDIRECT_COOKIE_NAME) || '/';

  if (!code) {
    return {
      error: 'Code invalid or not provided'
    };
  }

  switch (provider) {
    case 'github':
    default:
      return exchangeGithubAccessToken(
        code,
        fetch,
        lang as (typeof APP_LANGS)[number] | undefined
      )
        .then((response) => {
          if (!(response.access_token && response.token_type)) {
            if (response.error) {
              return {
                error: response.error_description || response.error,
                jwt: null,
                provider,
                redirect
              };
            }
            return {
              error: 'No access token resolved or invalid response format',
              jwt: null,
              provider,
              redirect
            };
          }

          const jwt = saveAccessTokenToJWT(
            response.access_token,
            response.token_type
          );

          cookies.set(GH_OAUTH_COOKIE_NAME, jwt, {
            path: '/',
            maxAge: OAUTH_COOKIE_TTL_S
          });

          return { error: null, jwt, provider, redirect };
        })
        .catch((error) => {
          console.error(error);
          return {
            error: error?.toString(),
            jwt: null,
            provider,
            redirect
          };
        });
  }
};
