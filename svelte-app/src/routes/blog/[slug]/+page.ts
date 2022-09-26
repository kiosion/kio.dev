import { findPost } from '$stores/blog';
import type { ResData, PostDocument } from '$lib/types';
import { error } from '@sveltejs/kit';
import Logger from '$lib/logger';

export const load: import('./$types').PageLoad = async ({
  parent,
  fetch,
  params
}) => {
  await parent();

  let postData: ResData<PostDocument> | undefined;

  await findPost(fetch, { slug: params.slug })
    .then((res) => {
      if (res.error) {
        throw error(res.code, res.error);
      }
      postData = res;
    })
    .catch((e) => {
      Logger.error(e, `routes/blog/${params.slug}`);
      throw error(
        e.status ? e.status : 500,
        e.message ? e.message : 'Something went wrong'
      );
    });

  return {
    post: postData
  };
};
