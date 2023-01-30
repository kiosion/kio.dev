import { AVAILABLE_OAUTH_PROVIDERS } from '$lib/consts';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string) => {
  return !!AVAILABLE_OAUTH_PROVIDERS.find(
    (p) => p.toLowerCase() === param.toLowerCase()
  );
};
