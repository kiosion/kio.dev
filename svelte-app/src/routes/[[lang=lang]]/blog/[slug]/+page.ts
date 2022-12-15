import { ENV } from '$lib/env';
import Logger from '$lib/logger';
import Store from '$lib/store';
import { error } from '@sveltejs/kit';
import { getHeadings } from '$helpers/pt';
import type { ResData, PostDocument, PTBlock } from '$types';
import type { PageLoad } from './$types';

export const ssr = !(ENV === 'testing');

export const load: PageLoad = async ({ parent, fetch, params }) => {
  await parent();

  const post: ResData<PostDocument> | undefined =
    await Store.findOne<PostDocument>(fetch, 'post', {
      idb: btoa(params.slug)
    }).catch((err: unknown) => {
      Logger.error(err as string, `routes/blog/${params.slug}`);
      return undefined;
    });

  if (!post) {
    throw error(404, {
      message: "Sorry, that post couldn't be found or doesn't exist"
    });
  }

  const headings = await getHeadings((post?.data.body ?? []) as PTBlock[]);

  return { post, headings };
};
