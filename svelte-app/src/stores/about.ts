import { writable } from 'svelte/store';
import { API_URL } from '$lib/env';
import Cache from '$lib/cache';
import type { RouteFetch, ResData, AuthorDocument } from '$lib/types';

const Store = new Cache();

export const about = writable({} as ResData<AuthorDocument>);

export const fetchAbout = async (fetch: RouteFetch) => {
  const url = `${API_URL}get/about`;
  try {
    const res = await fetch(url);
    const response = await res.json();
    return response;
  } catch (err) {
    const error = err as Record<string, unknown>;
    return JSON.stringify({
      error: {
        status: error?.code ?? 500,
        message: error?.message
      }
    });
  }
};

export const findAbout = async (fetch: RouteFetch) => {
  const cacheKey = Store.getCacheKey('about', {});
  if (Store.has(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await fetchAbout(fetch);
    Store.set(cacheKey, response);
    return response;
  }
};
