import { ENV } from '$lib/env';
import Logger from '$lib/logger';
import Store from '$lib/store';
import type { ResData, PostDocument } from '$lib/types';
import type { PageLoad } from './$types';

export const ssr = !(ENV === 'testing');

export const load: PageLoad = async ({ parent, fetch, params }) => {
  await parent();

  const post: ResData<PostDocument> | undefined =
    await Store.findOne<PostDocument>(fetch, 'post', {
      id: params.slug
    }).catch((err: unknown) => {
      Logger.error(err as string, `routes/blog/${params.slug}`);
      return undefined;
    });

  const headings =
    (await (
      await fetch('/api/get/parsedPt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post?.data.body ?? [])
      })
    )?.json()) ?? [];

  return { post, headings };
};
