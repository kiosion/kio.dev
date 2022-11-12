import { redirect } from '@sveltejs/kit';
import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
import Logger from '$lib/logger';
import Store from '$lib/store';
// import { linkTo } from '$i18n';
import type { PageLoad } from './$types';
import type { ResDataMany, PostDocument, DocumentTags } from '$lib/types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (params.slug === '') {
    throw redirect(301, '/blog/');
  }

  await parent();

  // TODO: Check if this is a valid tag or not before querying!
  // Logger.info('params.slug', params.slug);
  // const allTags: ResDataMany<DocumentTags> | undefined =
  //   await Store.find<DocumentTags>(fetch, 'tag', {
  //     limit: 0
  //   }).catch((err: unknown) => {
  //     Logger.error(err as string);
  //     return undefined;
  //   });

  // if (!allTags) {
  //   Logger.error('Failed to fetch tags from Store');
  // }

  // if (
  //   !allTags?.data.some(
  //     (tag) => tag.title === params.slug || tag.slug.current === params.slug
  //   )
  // ) {
  //   Logger.info(`Tag ${params.slug} not found`);
  //   Logger.info(allTags?.data ?? 'No tags found');
  //   throw redirect(301, linkTo('/blog'));
  // }

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
