import { unwrapAPIResponse } from '$lib/api/result';
import { find } from '$lib/api/store';
import { DEFAULT_POST_QUERY_PARAMS } from '$lib/consts';
import type { Tag } from '$types/generated/sanity.types';

import type { LayoutLoad } from './$types';

export const load = (async ({ parent, fetch }) => {
  const parentData = await parent();

  const posts = unwrapAPIResponse(
    await find(fetch, 'post', DEFAULT_POST_QUERY_PARAMS)
  ) ?? [];

  const [tags, tagCounts]: [Pick<Tag, '_id' | 'slug' | 'title'>[], Record<string, number>] = (() => {
    const counts: Record<string, number> = {};
    const acc: Pick<Tag, '_id' | 'slug' | 'title'>[] = [];

    for (const p of posts) {
      for (const t of p.tags ?? []) {
        counts[t._id] = (counts[t._id] ?? 0) + 1;
        if (counts[t._id] === 1) {
          acc.push(t);
        }
      }
    }

    for (let i = 1; i < acc.length; i++) {
      const cur = acc[i];
      const curCount = counts[cur._id];
      let j = i - 1;
      while (
        j >= 0 &&
        (counts[acc[j]._id] < curCount ||
          (counts[acc[j]._id] === curCount && acc[j].title.localeCompare(cur.title) > 0))
      ) {
        acc[j + 1] = acc[j];
        j--;
      }
      acc[j + 1] = cur;
    }

    return [acc, counts];
  })();

  return {
    breadcrumbs: [...parentData.breadcrumbs, { label: 'Thoughts', href: '/thoughts' }],
    posts,
    tags,
    tagCounts
  };
}) satisfies LayoutLoad;
