import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string) => {
  return param === '+' || param === '%2B';
};
