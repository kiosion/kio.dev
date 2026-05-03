export const BASE_DOMAIN = 'kio.dev';

export const BASE_PAGE_TITLE = BASE_DOMAIN;

export const BASE_GIT_URL = 'https://github.com/kiosion/kio.dev';

export const BASE_ANIMATION_DURATION = 250 as const;

export const HOMEPAGE_POSTS_NUM = 4 as const;

interface AppRoute {
  name: string;
  path: string;
  desc?: string;
}

export const APP_ROUTES = [
  {
    name: 'About',
    path: '/',
    desc: 'A little about me and what I do.',
  },
  {
    name: 'Thoughts',
    path: '/thoughts',
    desc: 'My notes, guides, and thoughts on programming, security, finance, and more.',
  },
  {
    name: 'Etc',
    path: '/etc',
    desc: 'Miscellaneous and how to reach me.',
  },
] as const satisfies AppRoute[];

export const NAV_LINKS = APP_ROUTES.map((r) => ({
  name: r.name,
  url: r.path,
}));
