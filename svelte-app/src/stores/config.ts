import { writable } from 'svelte/store';
import { API_URL } from '$lib/env';
import Cache from '$lib/cache';
import type { RouteFetch, ResData, StoreRes, SiteConfig } from '$lib/types';

const Store = new Cache();

export const config = writable({} as ResData<SiteConfig>);

export const fetchConfig = async (
  fetch: RouteFetch
): Promise<StoreRes<SiteConfig>> => {
  const url = `${API_URL}getConfig`;
  try {
    const res = await fetch(url);
    const response = await res.json();
    return { data: response };
  } catch (err) {
    return {
      error: {
        code: 500,
        error: err as string,
        status: 'Store error'
      }
    };
  }
};

export const findConfig = async (fetch: RouteFetch) => {
  const cacheKey = Store.getCacheKey('config', {});
  if (Store.has(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await fetchConfig(fetch);
    if (response.error) {
      return response.error;
    }
    response.data && Store.set(cacheKey, response.data);
    return response.data;
  }
};
