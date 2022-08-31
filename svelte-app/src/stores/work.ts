import { writable } from 'svelte/store';
import { API_URL } from '$lib/env';
import Cache from '$lib/cache';
import Logger from '$lib/logger';
import type {
  RouteFetch,
  StoreRes,
  ResData,
  ResDataMany,
  ProjectDocument,
  DocumentQueryParams,
  SingleDocumentQueryParams
} from '$lib/types';

const Store = new Cache();

export const projects = writable({} as ResDataMany<ProjectDocument>);
export const project = writable({} as ResData<ProjectDocument>);

export const queryProjects = async (
  fetch: RouteFetch,
  params: DocumentQueryParams
): Promise<StoreRes<ResDataMany<ProjectDocument>>> => {
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
      return {
        error: {
          code: response.code ?? 404,
          error: response.error ?? 'Projects not found',
          status: 'Store error'
        }
      };
    }
    return { data: response };
  } catch (err: unknown) {
    Logger.error('Failed to query endpoint', 'store/queryProjects');
    return {
      error: {
        code: 500,
        error: err as string,
        status: 'Store error'
      }
    };
  }
};

export const queryProject = async (
  fetch: RouteFetch,
  params: SingleDocumentQueryParams
): Promise<StoreRes<ResData<ProjectDocument>>> => {
  const { slug = '', id = '' } = params;
  const url = `${API_URL}getProject?slug=${slug}&id=${id}`;
  try {
    const res = await fetch(url);
    const response = await res.json();
    if (!response.meta || response.meta.count === 0) {
      Logger.error('Failed to get non-existent project', 'store/queryPost');
      return {
        error: {
          error: 'Project not found',
          status: 'Store error',
          code: 404
        }
      };
    } else if (response.error) {
      Logger.error('Failed to get project', 'store/queryPost');
      throw response.error;
    }
    return { data: response };
  } catch (err: unknown) {
    Logger.error('Failed to query endpoint', 'store/queryProject');
    return {
      error: {
        code: 500,
        error: err as string,
        status: 'Store error'
      }
    };
  }
};

export const findProjects = async (
  fetch: RouteFetch,
  params: DocumentQueryParams
) => {
  params = Object.assign(
    {
      limit: 10,
      skip: 0,
      sort: 'date',
      order: 'desc',
      date: ''
    },
    params
  );
  const cacheKey = Store.getCacheKey('projects', params);
  if (Store.has(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await queryProjects(fetch, params);
    if (response.error) {
      return response.error;
    }
    response.data && Store.set(cacheKey, response.data);
    return response.data;
  }
};

export const findProject = async (
  fetch: RouteFetch,
  params: SingleDocumentQueryParams
) => {
  const cacheKey = Store.getCacheKey('project', params);
  if (Store.has(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await queryProject(fetch, params);
    if (response.error) {
      return response.error;
    }
    response.data && Store.set(cacheKey, response.data);
    return response.data;
  }
};
