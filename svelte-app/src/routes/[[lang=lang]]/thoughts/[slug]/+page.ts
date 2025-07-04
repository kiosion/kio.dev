import { browser } from '$app/environment';
import { isAPISuccess, unwrapAPIResponse } from '$lib/api/result';
import { findOne, incViews } from '$lib/api/store';
import { DEFAULT_APP_LANG } from '$lib/consts';

import type { PageLoad } from './$types';
import type { SingleParams } from '$lib/api/store';
import type { HeadingNode } from '$types/documents';
import type { GetPostQueryResult } from '$types/generated/sanity.types';

export const load = (async ({ parent, fetch, params, url }) => {
  const preview = url.searchParams.get('preview') === 'true',
    opts: SingleParams<'post'> = {
      slug: params.slug,
      lang: params.lang || DEFAULT_APP_LANG
    };

  preview && (opts.preview = true);

  let post: NonNullable<GetPostQueryResult & { headings: HeadingNode[] }> | undefined;

  if (browser) {
    const _parent = await parent();
    post = _parent?.posts?.find?.((p) => p.slug?.current === params.slug);
  }

  if (!post) {
    post = unwrapAPIResponse(await findOne(fetch, 'post', opts));
  }

  if (post) {
    incViews(fetch, post).then((res) => {
      if (isAPISuccess(res)) {
        post.views = res.data.views;
      }
    });
  }

  return { post, routeFetch: fetch };
}) satisfies PageLoad;
