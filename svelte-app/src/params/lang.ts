import type { ParamMatcher } from '@sveltejs/kit';
import { APP_LANGS } from '$lib/consts';

export const match: ParamMatcher = (param: string) => {
  return APP_LANGS.includes(param);
};
