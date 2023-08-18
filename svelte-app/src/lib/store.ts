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

type PossibleParams = {
  [key: string]: string | number | boolean | string[] | number[] | boolean[];
};

interface DocumentRegistry {
  about: AuthorDocument;
  config: SiteConfig;
  post: PostDocument;
  project: ProjectDocument;
  tag: DocumentTags;
}

type QueryResponse<T> =
  | {
      meta: unknown;
      data?: T;
      error: never;
    }
  | {
      error: Error;
      meta: never;
      data: never;
    }
  | undefined;

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

const find = async <T extends keyof DocumentRegistry>(
  fetch: RouteFetch,
  model: T,
  params: PossibleParams = {}
) => {
  const cacheKey = JSON.stringify({ model, params, many: true });
  if (cacheKey in documentCache) {
    return documentCache[cacheKey] as DocumentRegistry[T][];
  }

  const url = constructUrl(model, params, true);
  let response: DocumentRegistry[T][] | undefined;

  try {
    const fetchResponse = (await tryFetch(fetch(url)).then(
      async (r) => await r.json()
    )) as QueryResponse<DocumentRegistry[T][]>;
    if (!fetchResponse?.meta || fetchResponse?.error) {
      Logger.error(`Failed to query ${model}`, fetchResponse?.error);
      return undefined;
    }
    response = fetchResponse?.data;
  } catch (e) {
    Logger.error(`Failed to query ${model}`, e);
    return undefined;
  }

  if (response) {
    documentCache[cacheKey] = response;
  }
  return response;
};

const findOne = async <T extends keyof DocumentRegistry>(
  fetch: RouteFetch,
  model: T,
  params: PossibleParams = {}
) => {
  const cacheKey = JSON.stringify({ model, params, many: false });
  if (cacheKey in documentCache) {
    return documentCache[cacheKey] as DocumentRegistry[T];
  }

  const url = constructUrl(model, params);
  let response: DocumentRegistry[T] | undefined;

  try {
    const fetchResponse = (await tryFetch(fetch(url)).then(
      async (r) => await r.json()
    )) as QueryResponse<DocumentRegistry[T]>;
    if (!fetchResponse?.meta || fetchResponse?.error) {
      Logger.error(`Failed to query ${model}`, fetchResponse?.error);
      return undefined;
    }
    response = fetchResponse?.data;
  } catch (e) {
    Logger.error(`Failed to query ${model}`, e);
    return undefined;
  }

  if (response) {
    documentCache[cacheKey] = response;
  }
  return response;
};

export { find, findOne };
