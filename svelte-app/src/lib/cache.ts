import { get as value, writable } from 'svelte/store';

export default class Cache {
  private queryCache = writable(new Map<string, string>());

  getCacheKey = (model: string, query: any) => {
    return JSON.stringify({ model, query });
  };

  has = (queryCacheKey: string) => {
    return value(this.queryCache).has(queryCacheKey);
  };

  get = (queryCacheKey: string) => {
    return JSON.parse(value(this.queryCache).get(queryCacheKey)!) ?? undefined;
  };

  set = (queryCacheKey: string, data: any) => {
    this.queryCache.update((current) => {
      current.set(queryCacheKey, JSON.stringify(data));
      return current;
    });
  };
}
