import { findPosts } from '$stores/blog';
import Logger from '$lib/logger';
import type { PageLoad } from './$types';
import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
import { redirect } from '@sveltejs/kit';
import type { ResDataMany, PostDocument } from '$lib/types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (params.slug === '') {
    throw redirect(301, '/blog/');
  }

  await parent();

  let postsData: ResDataMany<PostDocument> | undefined;

  await findPosts(fetch, {
    limit: PAGINATION_POSTS_PER_PAGE,
    tags: [params.slug]
  })
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      postsData = res;
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/blog');
    });

  return {
    posts: postsData
  };
};
