import { handleLoadError } from '$lib/data';

import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
  const about = handleLoadError(await parent().then((data) => data.about));

  return { about };
}) satisfies PageLoad;
