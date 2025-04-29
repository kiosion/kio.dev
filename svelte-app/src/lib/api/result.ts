import { ERRORS } from '$lib/consts';

import { error } from '@sveltejs/kit';

export type Result<T> = [T, undefined] | [T | undefined, Error];

export const unwrap = <T>([data, err]: Result<T>): T => {
  if (err || !data) {
    throw error(err?.code || 500, {
      message: err?.message || ERRORS.GENERIC_SOMETHING_WENT_WRONG,
      stack: err?.stack
    });
  }
  return data;
};
