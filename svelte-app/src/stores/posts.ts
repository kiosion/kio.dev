import { writable } from 'svelte/store';
import Cache from './store';

export const postsWritable = writable([]);
export const postWritable = writable({});

export const queryPosts = async (params) => {
  const {
    limit = 10,
    skip = 0,
    sort = 'date',
    order = 'desc',
    date = '',
    tags = ''
  } = params;
  const url = `${
    import.meta.env.VITE_BASE_URL
  }/api/getPosts?limit=${limit}&skip=${skip}&s=${sort}&o=${order}&date=${date}&tags=${tags}`;
  const res = await fetch(url);
  const response = await res.json();
  return response;
};

export const queryPost = async (params) => {
  const { slug = '' } = params;
  const url = `${import.meta.env.VITE_BASE_URL}/api/getPost?slug=${slug}`;
  const res = await fetch(url);
  const response = await res.json();
  return response;
};

export const findPosts = async (params) => {
  const cacheKey = Cache.getCacheKey('posts', params);
  if (Cache.has(cacheKey)) {
    return Cache.get(cacheKey);
  } else {
    const response = await queryPosts(params);
    Cache.set(cacheKey, response);
    return response;
  }
};

export const findPost = async (params) => {
  const cacheKey = Cache.getCacheKey('post', params);
  if (Cache.has(cacheKey)) {
    return Cache.get(cacheKey);
  } else {
    const response = await queryPost(params);
    Cache.set(cacheKey, response);
    return response;
  }
};
