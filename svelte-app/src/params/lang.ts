import { APP_LANGS } from '$lib/consts';

import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string) => APP_LANGS.includes(param);
