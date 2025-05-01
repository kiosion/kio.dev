import { unwrapAPIResponse } from '$lib/api/result';
import { find } from '$lib/api/store';
import { DEFAULT_APP_LANG, DEFAULT_PROJECT_QUERY_PARAMS } from '$lib/consts';

import type { LayoutLoad } from './$types';

export const load = (async ({ parent, fetch, params }) => {
  const config = await parent().then((data) => data.config);
  const projects = unwrapAPIResponse(
    await find(fetch, 'project', {
      ...DEFAULT_PROJECT_QUERY_PARAMS,
      lang: params.lang || DEFAULT_APP_LANG
    })
  );

  return { config, projects };
}) satisfies LayoutLoad;
