import { writable } from 'svelte/store';
import { API_URL } from '$lib/env';
import Cache from '$lib/cache';
import Logger from '$lib/logger';
// eslint-disable-next-line no-duplicate-imports
import type { Writable } from 'svelte/store';
import type {
  PostsQueryParams,
  PostQueryParams,
  RouteFetch,
  Post
} from '$lib/types';

const Store = new Cache();

export const posts = writable([]) as Writable<Post[]>;
export const post = writable({}) as Writable<Post>;

export const queryPosts = async (
  fetch: RouteFetch,
  params: PostsQueryParams
) => {
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
    if (!response.meta || response.error) {
      Logger.error('Failed to get posts', 'store/queryPost');
      return JSON.stringify({
        error: response.error,
        status: 'Store error'
      });
    }
    return response;
  } catch (err: any) {
    Logger.error('Failed to query endpoint', 'store/queryPosts');
    return JSON.stringify({
      error: err,
      status: 'Store error'
    });
  }
};

export const queryPost = async (fetch: RouteFetch, params: PostQueryParams) => {
  const { slug = '' } = params;
  const url = `${API_URL}getPost?slug=${slug}`;
  try {
    const res = await fetch(url);
    const response = await res.json();
    if (!response.meta || response.error) {
      Logger.error('Failed to get post', 'store/queryPost');
      return JSON.stringify({
        error: response.error,
        status: 'Store error'
      });
    }
    return response;
  } catch (err) {
    Logger.error('Failed to query endpoint', 'store/queryPost');
    return JSON.stringify({
      error: err,
      status: 'Store error'
    });
  }
};

export const findPosts = async (
  fetch: RouteFetch,
  params: PostsQueryParams = {
    limit: 10,
    skip: 0,
    sort: 'date',
    order: 'desc',
    date: ''
  }
) => {
  const cacheKey = Store.getCacheKey('posts', params);
  if (Store.has(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await queryPosts(fetch, params);
    Store.set(cacheKey, response);
    return response;
  }
};

export const findPost = async (
  fetch: RouteFetch,
  params: PostQueryParams = { slug: '' }
) => {
  const cacheKey = Store.getCacheKey('post', params);
  if (Store.has(cacheKey)) {
    return Store.get(cacheKey);
  } else {
    const response = await queryPost(fetch, params);
    Store.set(cacheKey, response);
    return response;
  }
};

// Probably doesn't work lol
export const findReloadPosts = async (
  fetch: RouteFetch,
  params: PostsQueryParams = {
    limit: 10,
    skip: 0,
    sort: 'date',
    order: 'desc',
    date: ''
  }
) => {
  const cacheKey = Store.getCacheKey('posts', params);
  if (Store.has(cacheKey)) {
    try {
      return await findPosts(fetch, params);
    } finally {
      const response = await queryPosts(fetch, params);
      Store.set(cacheKey, response);
      posts.set(response);
    }
  } else {
    const response = await queryPosts(fetch, params);
    Store.set(cacheKey, response);
    posts.set(response);
    return response;
  }
};

export const findReloadPost = async (
  fetch: RouteFetch,
  params: PostQueryParams = { slug: '' }
) => {
  const cacheKey = Store.getCacheKey('post', params);
  if (Store.has(cacheKey)) {
    try {
      return await findPost(fetch, params);
    } finally {
      const response = await queryPost(fetch, params);
      Store.set(cacheKey, response);
      post.set(response);
    }
  } else {
    const response = await queryPost(fetch, params);
    Store.set(cacheKey, response);
    post.set(response);
    return response;
  }
};
