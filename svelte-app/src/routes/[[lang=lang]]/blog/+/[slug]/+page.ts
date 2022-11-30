import { error, redirect } from '@sveltejs/kit';
import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
import Logger from '$lib/logger';
import Store from '$lib/store';
import type { PageLoad } from './$types';
import type { ResDataMany, PostDocument, DocumentTags } from '$types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (params.slug === '') {
    throw redirect(301, params.lang === 'fr' ? '/fr/blog/' : '/blog/');
  }

  await parent();

  const allTags: ResDataMany<DocumentTags> | undefined =
    await Store.find<DocumentTags>(fetch, 'tag', {
      type: 'post',
      limit: 0
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });

  if (
    !allTags?.data?.some(
      (tag) =>
        tag.slug.current?.toLowerCase() === params.slug?.toLowerCase() ||
        tag.title?.toLowerCase() === params.slug?.toLowerCase()
    )
  ) {
    Logger.info('Tag not found', params.slug);
    if (!allTags?.data) {
      console.warn('Failed to fetch tags');
    }
    // TODO: Find i18n alternative since linkTo can't work outside client component ctx
    throw error(404, {
      message: "Sorry, that tag couldn't be found or doesn't exist"
    });
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
