import { findPosts } from '$stores/blog';
import Logger from '$lib/logger';
import type { PageLoad } from './$types';
import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
import { redirect } from '@sveltejs/kit';
import type { ResDataMany, PostDocument } from '$lib/types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (parseInt(params.page) < 1) {
    throw redirect(301, '/blog/1');
  }

  const skip = (parseInt(params?.page || '1') - 1) * PAGINATION_POSTS_PER_PAGE;

  await parent();

  let postsData: ResDataMany<PostDocument> | undefined;

  await findPosts(fetch, { skip, limit: skip + PAGINATION_POSTS_PER_PAGE })
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
