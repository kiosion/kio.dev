import { get as value, writable } from 'svelte/store';

module Cache {
  export const queryCache = writable([]);

  export const getCacheKey = (model: string, query: any) => {
    return JSON.stringify({ model, query });
  };

  export const has = (queryCacheKey: string) => {
    return value(queryCache)[queryCacheKey] !== undefined;
  };

  export const get = (queryCacheKey: string) => {
    return JSON.parse(value(queryCache)[queryCacheKey]) ?? undefined;
  };

  export const set = (queryCacheKey: string, data: any) => {
    queryCache.update((cache) => {
      return {
        ...cache,
        [queryCacheKey]: JSON.stringify(data)
      };
    });
  };
}

export default Cache;
