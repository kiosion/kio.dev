import { browser } from '$app/environment';
import { tryFetch } from '$lib/data';
import { API_URL } from '$lib/env';
import Logger from '$lib/logger';

import type { NumericRange } from '@sveltejs/kit';
import type {
  DocumentTags,
  PostDocument,
  ProjectDocument,
  RouteFetch,
  SiteConfig
} from '$types';

type PossibleParams = {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | undefined;
};

export interface DocumentRegistry {
  config: SiteConfig;
  post: PostDocument;
  project: ProjectDocument;
  tag: DocumentTags;
}

type QueryResponse<T> =
  | {
      meta: unknown;
      data?: T;
      errors: string[];
    }
  | {
      errors: string[];
      meta: never;
      data: never;
    }
  | undefined;

const EXP_TIME = 1000 * 60 * 15; // 15 minutes

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

const incViews = (fetch: RouteFetch, doc: DocumentRegistry[keyof DocumentRegistry]) => {
  if (doc._type !== 'post' && doc._type !== 'project') {
    return;
  }

  try {
    fetch(`${API_URL}mutate`, {
      method: 'POST',
      body: JSON.stringify({
        id: doc._id,
        action: 'inc',
        field: 'views'
      })
    });
  } catch (e) {
    Logger.error('', e);
  }
};

const fetchData = async <T>(
  fetch: RouteFetch,
  url: string,
  model: keyof DocumentRegistry
): Promise<T | Error> => {
  try {
    const response = await tryFetch(fetch(url));
    const fetchResponse = (await response.json().catch((e) => {
      return {
        errors: [e.message || 'Failed to parse response.']
      };
    })) as QueryResponse<T>;

    if (fetchResponse?.errors?.length) {
      Logger.error(`Errors occured fetching ${model}.`, fetchResponse?.errors);
    }

    if (
      !(fetchResponse?.meta && fetchResponse?.data) ||
      (typeof fetchResponse?.data === 'object' &&
        Object.keys(fetchResponse.data).length === 0) ||
      (Array.isArray(fetchResponse?.data) &&
        !fetchResponse?.meta &&
        fetchResponse?.data.length === 0) ||
      ((fetchResponse?.meta as Record<string, unknown> | undefined)?.total !== 0 &&
        !fetchResponse?.data)
    ) {
      const err = new Error(`Failed to fetch ${model} data.`);

      err.code = (response.status || 500) as NumericRange<400, 599>;
      err.cause =
        fetchResponse?.errors || (!fetchResponse?.data && new Error('No data present'));

      return err;
    }

    return fetchResponse.data;
  } catch (e) {
    Logger.error(`Failed to fetch ${model}.`, e);
    return new Error(`Failed to fetch ${model} data.`, { cause: e });
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
  const cacheKey = JSON.stringify({ model, params, many: false }),
    url = constructUrl(model, params);

  if (browser && params.preview !== 'true') {
    const cachedData = cacheGet(cacheKey);
    if (cachedData) {
      incViews(fetch, cachedData as DocumentRegistry[T]);
      return cachedData as DocumentRegistry[T];
    }
  }

  const response = await fetchData<DocumentRegistry[T]>(fetch, url, model);
  if (browser && params.preview !== 'true' && response && !(response instanceof Error)) {
    cacheSet(cacheKey, response);
  }

  return response;
};

export { find, findOne };
