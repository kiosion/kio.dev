import type { EndpointOutput } from '@sveltejs/kit';

export const GET = async ({ request, params, url }): Promise<EndpointOutput> => {
  const remoteUrl = `${import.meta.env.VITE_API_URL}/v1/query/posts${url.search}`;
  const res = await fetch(remoteUrl, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`
    }
  });
  if (res.status !== 200) {
    throw new Error(`Error fetching posts: ${res.status}`);
  }
  const data = await res.json();
  return { body: data };
};
