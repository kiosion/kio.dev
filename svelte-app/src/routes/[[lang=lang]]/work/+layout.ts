import type { LayoutLoad } from './$types';

export const load = (async ({ parent }) => {
  const config = await parent().then((data) => data.config);
  return { config };
}) satisfies LayoutLoad;
