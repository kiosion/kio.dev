export const LOG_DIR = '$logs';

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

export const COLOR_TEXT_LIGHT = '#1E293B';
export const COLOR_TEXT_DARK = '#F1F5F9';
export const COLOR_BG_LIGHT = '#F1F5F9';
export const COLOR_BG_DARK = '#1E293B';

export const APP_LANGS = ['en', 'fr'];
export const DEFAULT_APP_LANG = 'en';

export const APP_ROUTES = [
  { name: 'Index', path: '/', hidden: true },
  {
    name: 'Blog',
    path: '/blog',
    children: [
      { name: 'Post', path: '/blog/:slug' },
      { name: 'All Posts', path: '/blog/:int' },
      { name: 'Tag', path: '/blog/+/:tag' }
    ],
    hidden: false
  },
  {
    name: 'Work',
    path: '/work',
    children: [
      { name: 'Project', path: '/work/:slug' },
      { name: 'All Projects', path: '/work/:int' },
      {
        name: 'Tags',
        path: '/work/+',
        children: [{ name: 'Tag', path: '/work/+/:tag' }]
      }
    ],
    hidden: false
  },
  {
    name: 'About',
    path: '/about',
    children: [
      { name: 'Resume', path: '/about/resume' },
      { name: 'Skills', path: '/about/skills' },
      { name: 'PGP', path: '/pgp' }
    ],
    hidden: false
  }
];

export const TOP_LEVEL_ROUTES = APP_ROUTES.map((r) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...rest } = r;
  return rest;
});

export const PAGINATION_POSTS_PER_PAGE = 6;
export const PAGINATION_PROJECTS_PER_PAGE = 6;

export const RECENT_POSTS_COUNT = 5;
export const RECENT_PROJECTS_COUNT = 5;

export const DEFAULT_POST_QUERY_PARAMS = {
  limit: PAGINATION_POSTS_PER_PAGE,
  skip: 0,
  sort: 'date',
  order: 'desc',
  date: '',
  tags: []
};

export const DEFAULT_PROJECT_QUERY_PARAMS = {
  ...DEFAULT_POST_QUERY_PARAMS,
  limit: PAGINATION_PROJECTS_PER_PAGE
};

export const DEFAULT_DESKTOP_WIDTH = 768;
export const DEFAULT_MOBILE_WIDTH = DEFAULT_DESKTOP_WIDTH - 1;

export const DEFAULT_DESKTOP_BREAKPOINT = `(min-width: ${DEFAULT_DESKTOP_WIDTH}px)`;
export const DEFAULT_MOBILE_BREAKPOINT = `(max-width: ${DEFAULT_MOBILE_WIDTH}px)`;

export const DEFAULT_BREAKPOINTS = {
  sm: DEFAULT_MOBILE_BREAKPOINT,
  lg: DEFAULT_DESKTOP_BREAKPOINT
};
