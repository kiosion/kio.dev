import { APP_LANGS } from '$lib/consts';

import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - param is string
  return param.length === 2 && APP_LANGS.includes(param);
};
