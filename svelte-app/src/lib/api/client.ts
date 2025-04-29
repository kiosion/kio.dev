import { ERRORS } from '$lib/consts';
import { API_URL } from '$lib/env';
import Logger from '$lib/logger';

import type { NumericRange } from '@sveltejs/kit';
import type { Result } from '$lib/api/result';
import type { RouteFetch } from '$types';

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

export type APIResponse<T> = APISuccess<T> | APIFailure;

export const request = async <T>(
  fetch: RouteFetch,
  path: string,
  options: RequestInit = {}
): Promise<Result<T>> => {
  try {
    const res = await fetch(`${API_URL}${path}`, options);
    const body = (await res.json()) as APIResponse<T>;
    const status = body.status;

    if ('errors' in body && body.errors?.length) {
      for (const error of body.errors) {
        Logger.error(`Error while fetching ${path}`, error);
      }
      // if (status >= 400) {
      //   return [
      //     undefined,
      //     new Error(body.errors[0], {
      //       code: status as NumericRange<400, 599>,
      //       stack: body.errors.join('\n')
      //     })
      //   ];
      // }
    }
    if (!('data' in body) || !body.data) {
      return [
        undefined,
        new Error(ERRORS.GENERIC_SOMETHING_WENT_WRONG, {
          code: (status >= 400 ? status : 500) as NumericRange<400, 599>,
          stack: body.errors?.join('\n') || ERRORS.GENERIC_NO_DATA
        })
      ];
    }

    return [body.data, undefined];
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    Logger.error(`Network or parse error while fetching ${path}`, error);
    return [undefined, error];
  }
};
