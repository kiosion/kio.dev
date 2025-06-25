/* eslint-disable no-redeclare */
import { browser } from '$app/environment';
import * as cache from '$lib/api/cache';
import { request } from '$lib/api/client';
import { type APIResponse, isAPISuccess } from '$lib/api/result';
import Logger from '$lib/logger';

import type { RouteFetch } from '$types';
import type { HeadingNode } from '$types/documents';
import type { GetConfigQueryResult, GetPostQueryResult, Tag } from '$types/sanity';

interface DocumentRegistry {
  config: NonNullable<GetConfigQueryResult>;
  post: NonNullable<GetPostQueryResult & { headings: HeadingNode[] }>;
  tag: Tag;
}

export type Model = keyof DocumentRegistry;

type BaseParams = {
  lang?: string;
  preview?: boolean;
};

type CollectionFilter = {
  page?: number;
  limit?: number;
  sort?: 'date' | 'title' | 'views' | 'publishedAt';
  order?: 'asc' | 'desc';
};

type SlugOrId =
  | {
      slug: string;
      id?: never;
    }
  | {
      slug?: never;
      id: string;
    };

export type SingleParams<M extends Model> = M extends 'post' | 'project'
  ? SlugOrId & BaseParams
  : BaseParams;

export type ManyParams<M extends Model> = M extends 'post' | 'project'
  ? { tags?: string[] } & CollectionFilter & BaseParams
  : M extends 'tag'
    ? CollectionFilter & BaseParams
    : BaseParams;

const buildPath = (
  model: string,
  many: boolean,
  params: Record<string, unknown> = {}
): string => {
  const url = new URL(`get/${model}${many ? 's' : ''}`, 'https://dummy');
  for (const [k, v] of Object.entries(params)) {
    if (!v) {
      continue;
    }
    if (Array.isArray(v)) {
      if (v.length > 0) {
        url.searchParams.append(k, v.join(','));
      }
    } else {
      url.searchParams.append(k, String(v));
    }
  }
  return url.pathname + url.search;
};

const withCache = async <T>(
  key: string,
  ttl: number,
  fn: () => Promise<APIResponse<T>>
): Promise<APIResponse<T>> => {
  if (!browser) {
    return await fn();
  }
  const cached = cache.get<T>(key);
  if (cached) {
    return {
      status: 200,
      data: cached
    };
  }
  const res = await fn();
  if (isAPISuccess(res)) {
    cache.set(key, res.data, ttl);
  }
  return res;
};

async function getOne<M extends 'post' | 'config' | 'tag'>(
  fetch: RouteFetch,
  model: M,
  params: SingleParams<M>
): Promise<APIResponse<DocumentRegistry[M]>>;

async function getOne<M extends 'config'>(
  fetch: RouteFetch,
  model: M,
  params?: SingleParams<M>
): Promise<APIResponse<DocumentRegistry[M]>>;

async function getOne<M extends Model>(
  fetch: RouteFetch,
  model: M,
  params?: SingleParams<M>
): Promise<APIResponse<DocumentRegistry[M]>> {
  const key = JSON.stringify({ model, params, many: false });
  return withCache(key, cache.DEFAULT_TTL, () =>
    request<DocumentRegistry[M]>(fetch, buildPath(model, false, params))
  );
}

async function getMany<M extends 'post' | 'tag'>(
  fetch: RouteFetch,
  model: M,
  params?: ManyParams<M>
): Promise<APIResponse<DocumentRegistry[M][]>> {
  const key = JSON.stringify({ model, params, many: true });
  return withCache(key, cache.DEFAULT_TTL, () =>
    request<DocumentRegistry[M][]>(fetch, buildPath(model, true, params))
  );
}

async function incViews<M extends 'post'>(
  fetch: RouteFetch,
  model: DocumentRegistry[M] & { _type: M }
): Promise<APIResponse<Pick<DocumentRegistry[M], '_id' | 'views'>>> {
  if (model._type !== 'post') {
    return {
      status: 400,
      errors: ['Invalid document type: ' + model._type]
    };
  }

  try {
    return await request<Pick<DocumentRegistry[M], '_id' | 'views'>>(fetch, 'mutate', {
      method: 'POST',
      body: JSON.stringify({
        id: model._id,
        action: 'inc',
        field: 'views'
      })
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    Logger.error(`Error incrementing views for ${model._type} ${model._id}`, error);

    return {
      status: 500,
      errors: ['Failed to increment views']
    };
  }
}

export { getMany as find, getOne as findOne, incViews };
