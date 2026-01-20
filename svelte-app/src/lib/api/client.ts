import type { APIResponse } from '$lib/api/result';
import { isAPIFailure } from '$lib/api/result';
import { API_URL } from '$lib/env';
import Logger from '$lib/logger';
import type { RouteFetch } from '$types';

export const request = async <T>(
  fetch: RouteFetch,
  path: string,
  options: RequestInit = {},
): Promise<APIResponse<T>> => {
  try {
    const res = await fetch(`${API_URL}${path}`, options);
    const body = (await res.json()) as APIResponse<T>;

    if (isAPIFailure(body)) {
      for (const error of body.errors) {
        Logger.error(`Error while fetching ${path}`, error);
      }
    }

    return body;
  } catch (err) {
    return {
      status: 500,
      errors: [
        'Failed to parse response',
        err instanceof Error ? err.message : 'Unknown error',
      ],
    };
  }
};
