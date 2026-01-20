import { APP_ROUTES, BASE_PAGE_TITLE } from '$lib/consts';
import { normalizePathname } from '$lib/utils';

export type Meta = { title: string; desc?: string };

export const getPageMeta = (basePathname?: string) => {
  const top = `/${
    normalizePathname(basePathname || '/')
      .slice(1)
      .split('/')[0]
  }`;
  const route = APP_ROUTES.find((r) => r.path === top);

  return {
    title: route?.name?.length ? `${route.name} | ${BASE_PAGE_TITLE}` : BASE_PAGE_TITLE,
    desc: route?.desc,
  };
};

export const scrollTo = (
  url: URL | undefined,
  scrollParams: ScrollIntoViewOptions = {},
) => {
  const { hash } = url || { hash: '' };

  if (!hash.length) {
    return;
  }

  const target =
    document.getElementById(hash.slice(1)) ||
    document.getElementById(`heading-${hash.slice(1)}`);

  target?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    ...scrollParams,
  });
};
