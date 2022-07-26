import { readable, writable } from 'svelte/store';

const postsWritable = writable([]);
const postWritable = writable({});
const isLoadingPosts = readable(false);
const isLoadingPost = readable(false);

const queryPosts = async ({ ...params }) => {
  const { limit = 10, skip = 0, sort = 'date', order = 'desc' } = params;
  isLoadingPosts.set(true);

  const url = `${process.env.API_URL}/v1/query/posts?limit=${limit}&skip=${skip}&s=${sort}&o=${order}`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Error fetching posts: ${res.status}`);
  }
  const json = await res.json();

  return json;
};

const queryPost = async ({ ...params }) => {
  const { slug = '' } = params;
  isLoadingPost.set(true);

  const url = `${process.env.API_URL}/v1/query/post?slug=${slug}`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Error fetching post: ${res.status}`);
  }
  const json = await res.json();

  return json;
};

export { postsWritable, postWritable, isLoadingPosts, isLoadingPost, queryPosts, queryPost };
