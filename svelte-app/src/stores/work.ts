import { writable } from 'svelte/store';
import { API_URL } from '$lib/env';
import Cache from '$lib/cache';
import Logger from '$lib/logger';
// eslint-disable-next-line no-duplicate-imports
import type { Writable } from 'svelte/store';
import type { RouteFetch } from '$lib/types';

const Store = new Cache();

export const projects = writable([]);

export const queryProjects = async (fetch: RouteFetch, params: any) => {
  const {
    limit = 10,
    skip = 0,
    sort = 'date',
    order = 'desc',
    date = ''
  } = params;
  const url = `${API_URL}getProjects?limit=${limit}&skip=${skip}&s=${sort}&o=${order}&date=${date}`;
  try {
    const res = await fetch(url);
    const response = await res.json();
    if (!response.meta || response.error) {
      Logger.error('Failed to get projects', 'store/queryProjects');
      return JSON.stringify({
        error: response.error,
        status: 'Store error'
      });
    }
    return response;
  } catch (err: any) {
    Logger.error('Failed to query endpoint', 'store/queryProjects');
    return JSON.stringify({
      error: err,
      status: 'Store error'
    });
  }
};

export const queryProject = async (fetch: RouteFetch, params: any) => {
  const { slug = '' } = params;
  const url = `${API_URL}getProject?slug=${slug}`;
  try {
    const res = await fetch(url);
    const response = await res.json();
    if (!response.meta || response.error) {
      Logger.error('Failed to get project', 'store/queryProject');
      return JSON.stringify({
        error: response.error,
        status: 'Store error'
      });
    }
    return response;
  } catch (err: any) {
    Logger.error('Failed to query endpoint', 'store/queryProject');
    return JSON.stringify({
      error: err,
      status: 'Store error'
    });
  }
};

export const findProjects = async (
  fetch: RouteFetch,
  params: any = {
    limit: 10,
    skip: 0,
    sort: 'date',
    order: 'desc',
    date: ''
  }
) => {
  const cacheKey = Store.getCacheKey('projects', params);
  if (Store.has(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await queryProjects(fetch, params);
    Store.set(cacheKey, response);
    return response;
  }
};

export const findProject = async (
  fetch: RouteFetch,
  params: any = { slug: '' }
) => {
  const cacheKey = Store.getCacheKey('project', params);
  if (Store.has(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await queryProject(fetch, params);
    Store.set(cacheKey, response);
    return response;
  }
};
