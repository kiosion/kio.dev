import { api, unwrap } from '$lib/api/client';
import { GetPostParamsSchema } from '$lib/api/schemas';
import { isAPISuccess } from '$lib/api/types';
import { DEFAULT_APP_LANG } from '$lib/consts';

import type { PageLoad } from './$types';
import type { z } from 'zod';

export const load = (async ({ parent, fetch, params, url }) => {
  const preview = url.searchParams.get('preview') === 'true',
    opts: z.input<typeof GetPostParamsSchema> = {
      slug: params.slug,
      lang: params.lang || DEFAULT_APP_LANG,
      preview
    },
    post = unwrap(await api.getPost(fetch, opts));

  // TODO(kiosion): This is a pretty ahborrent way to handle counting views, lol
  await api.incViews(fetch, post._id).then((res) => {
    if (isAPISuccess(res)) {
      post.views = res.data.views;
    }
  });

  return { post, routeFetch: fetch };
}) satisfies PageLoad;
