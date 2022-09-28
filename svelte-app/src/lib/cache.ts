import { get as value, writable } from 'svelte/store';
import type {
  DocumentQueryParams,
  ResData,
  SingleDocumentQueryParams,
  SiteConfig
} from '$lib/types';

type CacheData =
  | { [key: string]: unknown }
  | ResData<unknown>
  | SiteConfig
  | unknown[];
type CacheQuery =
  | { [key: string]: unknown }
  | DocumentQueryParams
  | SingleDocumentQueryParams;

export default class Cache {
  private queryCache = writable(new Map<string, string>());

  getCacheKey = (model: string, query: CacheQuery) => {
    return JSON.stringify({ model, query });
  };

  has = (queryCacheKey: string) => {
    return value(this.queryCache).has(queryCacheKey);
  };

  get = (queryCacheKey: string) => {
    const val = value(this.queryCache).get(queryCacheKey) ?? undefined;
    return val ? JSON.parse(val) : undefined;
  };

  set = (queryCacheKey: string, data: CacheData) => {
    this.queryCache.update((current) => {
      current.set(queryCacheKey, JSON.stringify(data as CacheData));
      return current;
    });
    return data;
  };
}
