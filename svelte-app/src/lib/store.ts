import { API_URL } from '$lib/env';
import Logger from '$lib/logger';
import tryFetch from '$lib/try-fetch';

import type {
  AuthorDocument,
  DocumentTags,
  PostDocument,
  ProjectDocument,
  RouteFetch,
  SiteConfig
} from '$types';

interface PossibleParams {
  [key: string]: string | number | boolean | string[] | number[] | boolean[];
}

interface DocumentRegistry {
  about: AuthorDocument;
  config: SiteConfig;
  post: PostDocument;
  project: ProjectDocument;
  tag: DocumentTags;
}

const documentCache = {} as {
  [query: string]: unknown[] | unknown;
};

const constructUrl = (
  model: keyof DocumentRegistry,
  params: PossibleParams,
  many = false
) => {
  const url = new URL(`http://fake${API_URL}get/${model}${many ? '/many' : ''}`);
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      return value.length ? url.searchParams.append(key, value.join(',')) : undefined;
    }
    return typeof value === 'boolean'
      ? url.searchParams.set(key, value.toString())
      : value.toString() !== '' && url.searchParams.set(key, value.toString());
  });
  return url.toString().replace('http://fake', '');
};

const query = async <T extends keyof DocumentRegistry>(
  fetch: RouteFetch,
  model: T,
  params: PossibleParams = {}
): Promise<DocumentRegistry[T][] | undefined> => {
  const url = constructUrl(model, params, true);
  try {
    const res = await tryFetch(fetch(url)).then(async (r) => await r.json());
    if (res.error || !res.meta) {
      Logger.error(`Failed to query ${model}`, res.error);
      return undefined;
    }
    return res?.data as DocumentRegistry[T][] | undefined;
  } catch (e) {
    Logger.error(`Failed to query ${model}`, e);
    return undefined;
  }
};

const queryOne = async <T extends keyof DocumentRegistry>(
  fetch: RouteFetch,
  model: T,
  params: PossibleParams = {}
): Promise<DocumentRegistry[T] | undefined> => {
  const url = constructUrl(model, params);
  try {
    const res = await tryFetch(fetch(url)).then(async (r) => await r.json());
    if (!res.meta || res.error) {
      Logger.error(`Failed to query ${model}`, res.error);
      return undefined;
    }
    return res?.data as DocumentRegistry[T] | undefined;
  } catch (e) {
    Logger.error(`Failed to query ${model}`, e);
    return undefined;
  }
};

const find = async <T extends keyof DocumentRegistry>(
  fetch: RouteFetch,
  model: T,
  params: PossibleParams = {}
): ReturnType<Awaited<typeof query<T>>> => {
  const cacheKey = JSON.stringify({ model, params, many: true });
  if (cacheKey in documentCache) {
    return documentCache[cacheKey] as DocumentRegistry[T][];
  }
  const response = await query(fetch, model, params);
  if (response) {
    documentCache[cacheKey] = response;
  }
  return response;
};

const findOne = async <T extends keyof DocumentRegistry>(
  fetch: RouteFetch,
  model: T,
  params: PossibleParams = {}
): ReturnType<Awaited<typeof queryOne<T>>> => {
  const cacheKey = JSON.stringify({ model, params, many: false });
  if (cacheKey in documentCache) {
    return documentCache[cacheKey] as DocumentRegistry[T];
  }
  const response = await queryOne(fetch, model, params);
  if (response) {
    documentCache[cacheKey] = response;
  }
  return response;
};

export { find, findOne, query, queryOne };
