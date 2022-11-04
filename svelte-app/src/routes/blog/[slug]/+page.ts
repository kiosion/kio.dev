import { ENV } from '$lib/env';
import Logger from '$lib/logger';
import Store from '$lib/store';
import type { ResData, PostDocument } from '$lib/types';

export const ssr = !(ENV === 'testing');

export const load: import('./$types').PageLoad = async ({
  parent,
  fetch,
  params
}) => {
  await parent();

  const post: ResData<PostDocument> | undefined =
    await Store.findOne<PostDocument>(fetch, 'post', {
      id: params.slug
    }).catch((err: unknown) => {
      Logger.error(err as string, `routes/blog/${params.slug}`);
      return undefined;
    });

  return { post };
};
