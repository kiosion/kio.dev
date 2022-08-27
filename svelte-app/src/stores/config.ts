import { writable } from 'svelte/store';
import { API_URL } from '$lib/env';
import Cache from '$lib/cache';
import type { RouteFetch, ResData } from '$lib/types';

const Store = new Cache();

export const config = writable({} as ResData);

export const fetchConfig = async (fetch: RouteFetch) => {
  const url = `${API_URL}getConfig`;
  try {
    const res = await fetch(url);
    const response = await res.json();
    return response;
  } catch (err) {
    return JSON.stringify({
      error: {
        message: err
      },
      status: 'Store error'
    });
  }
};

export const findConfig = async (fetch: RouteFetch) => {
  const cacheKey = Store.getCacheKey('config', {});
  if (Store.has(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await fetchConfig(fetch);
    Store.set(cacheKey, response);
    return response;
  }
};
