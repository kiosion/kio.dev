import { writable } from 'svelte/store';

const postsWritable = writable([]);
const postWritable = writable({});
const isLoadingPosts = writable(false);
const isLoadingPost = writable(false);

const queryPosts = async (params) => {
  const { limit = 10, skip = 0, sort = 'date', order = 'desc', date = '', tags = '' } = params;
  isLoadingPosts.set(true);
  const url = `${
    import.meta.env.VITE_BASE_URL
  }/api/getPosts?limit=${limit}&skip=${skip}&s=${sort}&o=${order}&date=${date}&tags=${tags}`;
  const res = await fetch(url);
  const response = await res.json();
  return response;
};

const queryPost = async (params) => {
  const { slug = '' } = params;
  isLoadingPost.set(true);
  const url = `${import.meta.env.VITE_BASE_URL}/api/getPost?slug=${slug}`;
  const res = await fetch(url);
  const response = await res.json();
  return response;
};

export { postsWritable, postWritable, isLoadingPosts, isLoadingPost, queryPosts, queryPost };
