import { browser } from '$app/environment';
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

export interface DocumentRegistry {
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

const EXP_TIME = 1000 * 60 * 30; // 30 minutes

const documentCache: Record<
  string,
  {
    exp: number;
    data:
      | DocumentRegistry[keyof DocumentRegistry]
      | DocumentRegistry[keyof DocumentRegistry][];
  }
> = {};

const cacheGet = (key: string) => {
  const item = documentCache[key];
  if (!item || isExpired(item.exp)) {
    delete documentCache[key];
    return undefined;
  }
  return item.data;
};

const cacheSet = (
  key: string,
  value:
    | DocumentRegistry[keyof DocumentRegistry]
    | DocumentRegistry[keyof DocumentRegistry][]
) => {
  documentCache[key] = {
    exp: Date.now() + EXP_TIME,
    data: value
  };
};

const isExpired = (timestamp: number): boolean => timestamp <= Date.now();

const constructUrl = (
  model: keyof DocumentRegistry,
  params: PossibleParams,
  many = false
) => {
  const basePath = `${API_URL}get/${model}${many ? '/many' : ''}`,
    queryParams = [];

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value) && value.length) {
      queryParams.push(`${key}=${value.join(',')}`);
    } else if (value !== null && value !== undefined && value.toString() !== '') {
      queryParams.push(`${key}=${value}`);
    }
  }

  return `${basePath}${queryParams.length ? `?${queryParams.join('&')}` : ''}`;
};

const fetchData = async <T>(
  fetch: RouteFetch,
  url: string,
  model: keyof DocumentRegistry
): Promise<T | Error> => {
  try {
    const response = await tryFetch(fetch(url));
    const fetchResponse = (await response.json()) as QueryResponse<T>;
    if (!(fetchResponse?.meta && fetchResponse?.data) || fetchResponse?.error) {
      Logger.error(`Failed to query ${model}`, fetchResponse?.error);
      return new Error(`Failed to query ${model} data`, {
        cause:
          fetchResponse?.error || (!fetchResponse?.data && new Error('No data present'))
      });
    }
    return fetchResponse.data;
  } catch (e) {
    Logger.error(`Failed to query ${model}`, e);
    return new Error(`Failed to query ${model} data`, { cause: e });
  }
};

const find = async <T extends keyof DocumentRegistry>(
  fetch: RouteFetch,
  model: T,
  params: PossibleParams = {}
): Promise<DocumentRegistry[T][] | Error> => {
  const cacheKey = JSON.stringify({ model, params, many: true });
  if (browser && params.preview !== 'true') {
    const cachedData = cacheGet(cacheKey);
    if (cachedData) {
      return cachedData as DocumentRegistry[T][];
    }
  }

  const url = constructUrl(model, params, true);
  const response = await fetchData<DocumentRegistry[T][]>(fetch, url, model);
  if (browser && params.preview !== 'true' && response && !(response instanceof Error)) {
    cacheSet(cacheKey, response);
  }

  return response;
};

const findOne = async <T extends keyof DocumentRegistry>(
  fetch: RouteFetch,
  model: T,
  params: PossibleParams = {}
): Promise<DocumentRegistry[T] | Error> => {
  const cacheKey = JSON.stringify({ model, params, many: false });
  if (browser && params.preview !== 'true') {
    const cachedData = cacheGet(cacheKey);
    if (cachedData) {
      return cachedData as DocumentRegistry[T];
    }
  }

  const url = constructUrl(model, params);
  const response = await fetchData<DocumentRegistry[T]>(fetch, url, model);
  if (browser && params.preview !== 'true' && response && !(response instanceof Error)) {
    cacheSet(cacheKey, response);
  }

  return response;
};

export { find, findOne };
