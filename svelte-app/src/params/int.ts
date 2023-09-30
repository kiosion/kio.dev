import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string) => /^\d+$/.test(param);
