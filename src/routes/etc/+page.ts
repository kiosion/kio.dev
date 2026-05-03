import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
  const parentData = await parent();

  return {
    breadcrumbs: [...parentData.breadcrumbs, { label: 'Et cetera', href: '/etc' }],
  };
}) satisfies PageLoad;
