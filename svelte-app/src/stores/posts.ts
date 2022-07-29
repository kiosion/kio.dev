import { writable } from 'svelte/store';
import { API_URL } from '$lib/env';
import Cache from './store';

interface PostsQueryParams {
  limit?: number;
  skip?: number;
  sort?: string;
  order?: string;
  date?: string;
  tags?: string[];
}

interface PostQueryParams {
  slug?: string;
}

interface RouteFetch {
  (info: RequestInfo, init?: RequestInit): Promise<Response>;
}

export const postsWritable = writable([]);
export const postWritable = writable({});

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
    return response;
  } catch (err) {
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
    return response;
  } catch (err) {
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
  const cacheKey = Cache.getCacheKey('posts', params);
  if (Cache.has(cacheKey)) {
    return Cache.get(cacheKey);
  } else {
    const response = await queryPosts(fetch, params);
    Cache.set(cacheKey, response);
    return response;
  }
};

export const findPost = async (
  fetch: RouteFetch,
  params: PostQueryParams = { slug: '' }
) => {
  const cacheKey = Cache.getCacheKey('post', params);
  if (Cache.has(cacheKey)) {
    return Cache.get(cacheKey);
  } else {
    const response = await queryPost(fetch, params);
    Cache.set(cacheKey, response);
    return response;
  }
};
