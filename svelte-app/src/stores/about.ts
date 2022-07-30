import { writable } from 'svelte/store';
import { API_URL } from '$lib/env';
import Cache from '$lib/cache';
import type { RouteFetch } from '$lib/types';

const Store = new Cache();

export const about = writable({});

export const fetchAbout = async (fetch: RouteFetch) => {
  const url = `${API_URL}getAbout`;
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
