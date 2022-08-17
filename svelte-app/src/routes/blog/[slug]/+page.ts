import { post, findPost } from '@/stores/posts';
import { error } from '@sveltejs/kit';
import Logger from '$lib/logger';

export const load: import('./$types').PageLoad = async ({
  parent,
  fetch,
  params
}) => {
  await parent();

  await findPost(fetch, { slug: params.slug })
    .then((res) => {
      if (res.error) {
        throw error(res.code, res.error);
      }
      post.set(res);
    })
    .catch((e) => {
      Logger.error(e, `routes/blog/${params.slug}`);
      throw error(
        e.status ? e.status : 500,
        e.message ? e.message : 'Something went wrong'
      );
    });
};
