import type { PageLoad } from './$types';

export const load = (async ({ parent, params }) => {
  const parentData = await parent();

  const activeTagTitle = parentData.tags.find(
    (t) => t.slug?.current === params.slug,
  )?.title;

  return {
    breadcrumbs: [
      ...parentData.breadcrumbs,
      { label: `#${activeTagTitle}`, href: `/thoughts/+/${params.slug}` },
    ],
  };
}) satisfies PageLoad;
