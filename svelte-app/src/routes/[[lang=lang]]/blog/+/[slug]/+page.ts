import { redirect } from '@sveltejs/kit';
import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
import Logger from '$lib/logger';
import Store from '$lib/store';
import type { PageLoad } from './$types';
import type { ResDataMany, PostDocument, DocumentTags } from '$types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (params.slug === '') {
    throw redirect(301, '/blog/');
  }

  await parent();

  const allTags: ResDataMany<DocumentTags> | undefined =
    await Store.find<DocumentTags>(fetch, 'tag', {
      type: 'post'
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });

  if (!allTags) {
    Logger.error('Failed to fetch tags from Store');
  }

  if (
    !allTags?.data?.some(
      (tag) => tag.slug.current === params.slug || tag.title === params.slug
    )
  ) {
    Logger.info('Tag not found', params.slug);
    Logger.info(allTags?.data ?? 'No tags found');
    // TODO: Find i18n alternative since linkTo can't work outside client component ctx
    throw redirect(301, params?.lang === 'fr' ? '/fr/blog' : '/blog');
  }

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
