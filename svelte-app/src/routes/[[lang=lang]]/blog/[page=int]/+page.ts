import { redirect } from '@sveltejs/kit';
import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
import Logger from '$lib/logger';
import Store from '$lib/store';
import type { PageLoad } from './$types';
import type { ResDataMany, PostDocument } from '$lib/types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (parseInt(params.page) < 1) {
    throw redirect(301, '/blog/1');
  }

  const skip = (parseInt(params?.page || '1') - 1) * PAGINATION_POSTS_PER_PAGE;

  await parent();

  const posts: ResDataMany<PostDocument> | undefined =
    await Store.find<PostDocument>(fetch, 'post', {
      limit: PAGINATION_POSTS_PER_PAGE,
      skip
    }).catch((err: unknown) => {
      Logger.error(err as string, `routes/blog/${params.page}`);
      return undefined;
    });

  return { posts };
};
