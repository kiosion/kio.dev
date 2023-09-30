import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string) => /^\.?well-known$/.test(param);
