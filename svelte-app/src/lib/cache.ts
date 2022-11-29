import { get as value, writable } from 'svelte/store';
import type {
  DocumentQueryParams,
  SingleDocumentQueryParams,
  ResData
} from '$types/api';
import type { SiteConfig } from '$types/config';

type CacheData =
  | Record<string, unknown>
  | ResData<unknown>
  | SiteConfig
  | unknown[];
type CacheQuery =
  | Record<string, unknown>
  | DocumentQueryParams
  | SingleDocumentQueryParams;

export default class Cache {
  private queryCache = writable(new Map<string, string>());

  getCacheKey = (model: string, query: CacheQuery = {}): string => {
    return JSON.stringify({ model, query });
  };

  has = (queryCacheKey: string) => {
    return value(this.queryCache).has(queryCacheKey);
  };

  get = (queryCacheKey: string) => {
    const val = value(this.queryCache).get(queryCacheKey) ?? undefined;
    return val ? (JSON.parse(val) as Record<string, unknown>) : undefined;
  };

  set = (queryCacheKey: string, data: CacheData) => {
    this.queryCache.update((current) => {
      current.set(queryCacheKey, JSON.stringify(data));
      return current;
    });
    return data;
  };

  delete = (queryCacheKey: string) => {
    let deleted = false;
    this.queryCache.update((current) => {
      deleted = current.delete(queryCacheKey);
      return current;
    });
    return deleted;
  };
}
