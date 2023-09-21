/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

const EXP_TIME = 1000 * 60 * 30;

const documentCache = new Proxy(
  {} as Record<
    string,
    | {
        exp: number;
        data:
          | DocumentRegistry[keyof DocumentRegistry][]
          | DocumentRegistry[keyof DocumentRegistry];
      }
    | undefined
  >,
  {
    get: (target, prop) => {
      switch (prop) {
        case 'get':
          return (key: string) => {
            if (!(key in target) || target[key] === undefined) {
              return undefined;
            }

            if (target[key]!.exp <= Date.now()) {
              target[key] = undefined;
              return undefined;
            }

            return target[key]!.data;
          };
        case 'set':
          return <T extends DocumentRegistry[keyof DocumentRegistry]>(
            key: string,
            value: T
          ) =>
            (target[key] = {
              exp: Date.now() + EXP_TIME,
              data: value
            });
        default:
          return undefined;
      }
    }
  }
) as unknown as {
  get: (
    key: string
  ) =>
    | DocumentRegistry[keyof DocumentRegistry]
    | DocumentRegistry[keyof DocumentRegistry][]
    | undefined;
  set: (
    key: string,
    value:
      | DocumentRegistry[keyof DocumentRegistry]
      | DocumentRegistry[keyof DocumentRegistry][]
  ) => boolean;
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
  if (documentCache.get(cacheKey)) {
    return documentCache.get(cacheKey) as DocumentRegistry[T][];
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
    documentCache.set(cacheKey, response);
  }
  return response;
};

const findOne = async <T extends keyof DocumentRegistry>(
  fetch: RouteFetch,
  model: T,
  params: PossibleParams = {}
) => {
  const cacheKey = JSON.stringify({ model, params, many: false });
  if (!(params.preview === 'true') && documentCache.get(cacheKey)) {
    return documentCache.get(cacheKey) as DocumentRegistry[T];
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

  if (!(params.preview === 'true') && response) {
    documentCache.set(cacheKey, response);
  }
  return response;
};

export { find, findOne };
