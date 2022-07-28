import { writable } from 'svelte/store';
import { API_URL } from '$lib/env';
import Cache from './store';

export const postsWritable = writable([]);
export const postWritable = writable({});

export const queryPosts = async (fetch, params = {}) => {
  const {
    limit = 10,
    skip = 0,
    sort = 'date',
    order = 'desc',
    date = '',
    tags = ''
  } = params;
  const url = `${API_URL}getPosts?limit=${limit}&skip=${skip}&s=${sort}&o=${order}&date=${date}&tags=${tags}`;
  const res = await fetch(url);
  const response = await res.json();
  return response;
};

export const queryPost = async (fetch, params = {}) => {
  const { slug = '' } = params;
  const url = `${API_URL}getPost?slug=${slug}`;
  const res = await fetch(url);
  const response = await res.json();
  return response;
};

export const findPosts = async (fetch, params = {}) => {
  const cacheKey = Cache.getCacheKey('posts', params);
  if (Cache.has(cacheKey)) {
    return Cache.get(cacheKey);
  } else {
    const response = await queryPosts(fetch, params);
    Cache.set(cacheKey, response);
    return response;
  }
};

export const findPost = async (fetch, params = {}) => {
  const cacheKey = Cache.getCacheKey('post', params);
  if (Cache.has(cacheKey)) {
    return Cache.get(cacheKey);
  } else {
    const response = await queryPost(fetch, params);
    Cache.set(cacheKey, response);
    return response;
  }
};
