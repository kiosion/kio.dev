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
  }/api/posts?limit=${limit}&skip=${skip}&s=${sort}&o=${order}&date=${date}&tags=${tags}`;
  const res = await fetch(url);
  const response = await res.json();

  isLoadingPosts.set(false);
  return response;
};

// const queryPost = async ({ ...params }) => {
//   const { slug = '' } = params;
//   isLoadingPost.set(true);

//   const url = `${import.meta.env.VITE_API_URL}/v1/query/post?slug=${slug}`;
//   const res = await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//       Bearer: import.meta.env.VITE_API_TOKEN
//     }
//   });
//   if (res.status !== 200) {
//     throw new Error(`Error fetching post: ${res.status}`);
//   }

//   return await res.json();
// };

export { postsWritable, postWritable, isLoadingPosts, isLoadingPost, queryPosts, queryPost };
