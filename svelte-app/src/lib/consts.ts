export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';
export const APP_THEMES = [LIGHT_THEME, DARK_THEME];

export const APP_LANGS = ['en', 'fr'];
export const DEFAULT_APP_LANG = APP_LANGS[0];

export const VALID_DOC_TYPES = ['post', 'project', 'about', 'config'] as const;

export const LOCAL_SETTINGS_KEY = 'kio-dev-settings';

export const BASE_PAGE_TITLE = 'kio.dev';

interface AppRoute {
  name: string;
  path: string;
  children?: AppRoute[];
  hidden?: boolean;
}

export const APP_ROUTES = [
  {
    name: 'Home',
    path: '/',
    hidden: false
  },
  {
    name: 'Blog',
    path: '/blog',
    children: [{ name: 'Post', path: '/blog/:slug' }],
    hidden: false
  },
  {
    name: 'Work',
    path: '/work',
    children: [{ name: 'Project', path: '/work/:slug' }],
    hidden: false
  },
  {
    name: 'Etc',
    path: '/etc',
    hidden: false
  }
] as AppRoute[];

export const TOP_LEVEL_ROUTES = APP_ROUTES.map((r) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...rest } = r;
  return rest;
}) as Omit<AppRoute, 'children'>[];

export const ROUTE_ORDER = ['index', 'blog', 'blog/*', 'work', 'work/*', 'etc'];

export const NAV_LINKS = TOP_LEVEL_ROUTES.filter((route) => !route.hidden)?.map(
  (route) => ({
    name: route.name,
    url: route.path
  })
);

export const BASE_TRANSITION_DURATION = 200 as const;
export const BASE_ANIMATION_DURATION = 300 as const;

export const HOMEPAGE_POSTS_NUM = 3 as const;
export const HOMEPAGE_PROJECTS_NUM = 3 as const;

export const RECENT_POSTS_COUNT = 99;
export const RECENT_PROJECTS_COUNT = 99;

export const DEFAULT_POST_QUERY_PARAMS = {
  limit: 99,
  skip: 0,
  sort: 'date',
  order: 'desc',
  date: '',
  tags: []
};

export const DEFAULT_PROJECT_QUERY_PARAMS = DEFAULT_POST_QUERY_PARAMS;

export const DEFAULT_DESKTOP_WIDTH = 1024;
export const DEFAULT_TABLET_WIDTH = 768;
export const DEFAULT_MOBILE_WIDTH = DEFAULT_TABLET_WIDTH - 1;

export const DEFAULT_DESKTOP_BREAKPOINT = `(min-width: ${DEFAULT_DESKTOP_WIDTH}px)`;
export const DEFAULT_TABLET_BREAKPOINT = `(min-width: ${DEFAULT_TABLET_WIDTH}px)`;
export const DEFAULT_MOBILE_BREAKPOINT = `(max-width: ${DEFAULT_MOBILE_WIDTH}px)`;
