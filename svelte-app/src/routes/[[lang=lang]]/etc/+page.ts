import { handleLoadError } from '$lib/data';

import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
  const config = handleLoadError(await parent().then((data) => data.config));

  return { config };
}) satisfies PageLoad;
