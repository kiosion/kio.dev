import { DEFAULT_APP_LANG } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { findOne } from '$lib/store';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, params, url }) => {
  const preview = url.searchParams.get('preview') === 'true' || false,
    project = handleLoadError(
      await findOne(fetch, 'project', {
        id: params.slug,
        lang: params.lang || DEFAULT_APP_LANG,
        preview
      })
    );

  return { project, routeFetch: fetch };
}) satisfies PageLoad;
