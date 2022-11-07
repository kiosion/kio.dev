import { redirect } from '@sveltejs/kit';
import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
import Logger from '$lib/logger';
import Store from '$lib/store';
import type { PageLoad } from './$types';
import type { ResDataMany, PostDocument } from '$lib/types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (params.slug === '') {
    throw redirect(301, '/blog/');
  }

  await parent();

  // TODO: Check if this is a valid tag or not before querying!

  const posts: ResDataMany<PostDocument> | undefined =
    await Store.find<PostDocument>(fetch, 'post', {
      limit: PAGINATION_POSTS_PER_PAGE,
      tags: [params.slug]
    }).catch((err: unknown) => {
      Logger.error(err as string, `routes/blog/+/${params.slug}`);
      return undefined;
    });

  return { posts };
};
