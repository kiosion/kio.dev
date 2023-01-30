import { AVAILABLE_OAUTH_PROVIDERS } from '$lib/consts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
  const { searchParams } = url;
  const provider = searchParams.get('provider');
  const actualProvider = AVAILABLE_OAUTH_PROVIDERS.find((p) => p === provider);

  if (!actualProvider) {
    return {};
  }

  return {
    provider: actualProvider
  };
};
