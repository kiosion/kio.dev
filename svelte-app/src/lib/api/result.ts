/* eslint-disable no-redeclare */
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

export type APISuccess<T> = {
  data: T;
  meta?: T extends ArrayLike<unknown>
    ? {
        count: number;
        total: number;
        page: {
          current: number;
          total: number;
        };
      }
    : undefined;
  errors?: string[];
  status: number;
};

export type APIFailure = {
  data?: undefined;
  meta?: undefined;
  errors: string[];
  status: number;
};

export const isAPISuccess = <T>(res: APIResponse<T>): res is APISuccess<NonNullable<T>> =>
  res.status >= 200 && res.status < 300;

export const isAPIFailure = <T>(res: APIResponse<T>): res is APIFailure =>
  res.status >= 400 && res.status < 600;

export function unwrapAPIResponse<T>(res: APIResponse<T>, noThrow: true): T | undefined;
export function unwrapAPIResponse<T>(res: APIResponse<T>, noThrow?: false): T;
export function unwrapAPIResponse<T, K = boolean>(
  res: APIResponse<T>,
  noThrow?: K
): T | undefined {
  if (isAPIFailure(res)) {
    if (noThrow) {
      return undefined;
    }
    throw error(res.status, {
      message: res.errors[0] || ERRORS.GENERIC_SOMETHING_WENT_WRONG,
      stack: res.errors.join('\n')
    });
  }

  return res.data;
}

export type APIResponse<T> = APISuccess<T> | APIFailure;
