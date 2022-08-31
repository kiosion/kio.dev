import { writable } from 'svelte/store';
import { API_URL } from '$lib/env';
import Cache from '$lib/cache';
import Logger from '$lib/logger';
import type {
  DocumentQueryParams,
  SingleDocumentQueryParams,
  PostDocument,
  RouteFetch,
  StoreRes,
  ResData,
  ResDataMany
} from '$lib/types';

const Store = new Cache();

export const posts = writable([] as unknown as ResDataMany<PostDocument>);
export const post = writable({} as ResData<PostDocument>);

export const queryPosts = async (
  fetch: RouteFetch,
  params: DocumentQueryParams
): Promise<StoreRes<ResDataMany<PostDocument>>> => {
  const {
    limit = 10,
    skip = 0,
    sort = 'date',
    order = 'desc',
    date = ''
  } = params;
  const url = `${API_URL}getPosts?limit=${limit}&skip=${skip}&s=${sort}&o=${order}&date=${date}`;
  try {
    const res = await fetch(url);
    const response = await res.json();
    if (response.error) {
      Logger.error('Failed to get posts', 'store/queryPost');
      throw response.error;
    }
    return { data: response };
  } catch (err: unknown) {
    Logger.error('Failed to query endpoint', 'store/queryPosts');
    return {
      error: {
        code: 500,
        error: err as string,
        status: 'Store error'
      }
    };
  }
};

export const queryPost = async (
  fetch: RouteFetch,
  params: SingleDocumentQueryParams
): Promise<StoreRes<ResData<PostDocument>>> => {
  const { slug = '', id = '' } = params;
  const url = `${API_URL}getPost?slug=${slug}&id=${id}`;
  try {
    const res = await fetch(url);
    const response = await res.json();
    if (!response.meta || response.meta.count === 0) {
      Logger.error('Failed to get non-existent post', 'store/queryPost');
      return {
        error: {
          error: 'Post not found',
          status: 'Store error',
          code: 404
        }
      };
    } else if (response.error) {
      Logger.error('Failed to get post', 'store/queryPost');
      throw response.error;
    }
    return { data: response };
  } catch (err: unknown) {
    Logger.error('Failed to query endpoint', 'store/queryPost');
    return {
      error: {
        error: err as string,
        status: 'Store error',
        code: 500
      }
    };
  }
};

export const findPosts = async (
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
  const cacheKey = Store.getCacheKey('posts', params);
  if (Store.has(cacheKey) && Store.get(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await queryPosts(fetch, params);
    if (response.error) {
      return response.error;
    }
    response.data && Store.set(cacheKey, response.data);
    return response.data;
  }
};

export const findPost = async (
  fetch: RouteFetch,
  params: SingleDocumentQueryParams
) => {
  const cacheKey = Store.getCacheKey('post', params);
  if (Store.has(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await queryPost(fetch, params);
    if (response.error) {
      return response.error;
    }
    response.data && Store.set(cacheKey, response.data);
    return response.data;
  }
};
