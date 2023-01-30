import { GH_OAUTH_COOKIE_NAME } from '$lib/consts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
  let jwt = cookies.get(GH_OAUTH_COOKIE_NAME);

  if (!jwt) {
    return {
      status: 'success' as const
    };
  }

  cookies.set(GH_OAUTH_COOKIE_NAME, '', {
    path: '/',
    maxAge: 0
  });
  jwt = cookies.get(GH_OAUTH_COOKIE_NAME);

  if (!jwt) {
    return {
      status: 'success' as const
    };
  }

  return {
    status: 'error' as const
  };
};
