import { cacheKey, withCache } from '$lib/api/cache';
import {
  GetConfigParamsSchema,
  GetPostParamsSchema,
  GetPostsParamsSchema
} from '$lib/api/schemas';
import { errorResponse, isAPISuccess } from '$lib/api/types';
import { API_URL } from '$lib/env';

import { error } from '@sveltejs/kit';

import type { APIResponse } from '$lib/api/types';
import type { RouteFetch } from '$types';
import type { HeadingNode } from '$types/documents';
import type {
  GetPostQueryResult,
  GetPostsQueryResult,
  SiteSettings
} from '$types/generated/sanity.types';
import type { z } from 'zod';

async function apiRequest<T>(
  fetch: RouteFetch,
  path: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(path, options);
    return await response.json();
  } catch {
    return errorResponse(500, 'Network error');
  }
}

function toSearchParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          searchParams.set(key, value.join(','));
        }
      } else if (typeof value === 'boolean') {
        if (value) {
          searchParams.set(key, 'true');
        }
      } else {
        searchParams.set(key, String(value));
      }
    }
  });
  return searchParams.toString();
}

export const api = {
  getConfig: (fetch: RouteFetch, params?: z.input<typeof GetConfigParamsSchema>) => {
    const search = params ? toSearchParams(params) : '';
    return withCache(cacheKey('config', params), () =>
      apiRequest<SiteSettings>(
        fetch,
        `${API_URL}/get/config${search ? `?${search}` : ''}`
      )
    );
  },

  getPost: (fetch: RouteFetch, params: z.input<typeof GetPostParamsSchema>) => {
    const search = toSearchParams(params);
    return withCache(cacheKey('post', params), () =>
      apiRequest<GetPostQueryResult & { headings: HeadingNode[] }>(
        fetch,
        `${API_URL}/get/post?${search}`
      )
    );
  },

  getPosts: (fetch: RouteFetch, params?: z.input<typeof GetPostsParamsSchema>) => {
    const search = params ? toSearchParams(params) : '';
    return withCache(cacheKey('posts', params), () =>
      apiRequest<(GetPostsQueryResult[number] & { headings: HeadingNode[] })[]>(
        fetch,
        `${API_URL}/get/posts${search ? `?${search}` : ''}`
      )
    );
  },

  incViews: (fetch: RouteFetch, id: string) =>
    apiRequest<{ _id: string; views: number }>(fetch, `${API_URL}/mutate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'inc', id, field: 'views' })
    })
} as const;

export const unwrapSafe = <T>(response: APIResponse<T>): T | undefined => {
  return isAPISuccess(response) ? response.data : undefined;
};

export const unwrap = <T>(response: APIResponse<T>): T => {
  if (isAPISuccess(response)) {
    return response.data;
  }

  const err = {
    message: response.errors?.[0] || 'Unknown error occurred',
    stack: response.errors?.join('\n') || undefined
  } satisfies App.Error;

  throw error(response.status || 500, err);
};
