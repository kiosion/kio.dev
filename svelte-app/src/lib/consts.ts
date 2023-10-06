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

export const HOMEPAGE_POSTS_NUM = 4 as const;
export const HOMEPAGE_PROJECTS_NUM = 1 as const;

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

export const LANGUAGE_COLOURS = new Proxy(
  new Map([
    ['asp', '#6a40fd'],
    ['basic', '#ff0000'],
    ['c', '#555555'],
    ['c#', '#178600'],
    ['c++', '#f34b7d'],
    ['css', '#563d7c'],
    ['clojure', '#db5855'],
    ['diff', '#88dddd'],
    ['dockerfile', '#384d54'],
    ['ejs', '#a91e50'],
    ['elixir', '#6e4a7e'],
    ['fish', '#4aae47'],
    ['fortran', '#4d41b1'],
    ['gleam', '#ffaff3'],
    ['go', '#375eab'],
    ['handlebars', '#01a9d6'],
    ['haskell', '#29b544'],
    ['html', '#e44b23'],
    ['java', '#b07219'],
    ['javascript', '#f1e05a'],
    ['json', '#292929'],
    ['jupyter notebook', '#DA5B0B'],
    ['kotlin', '#F18E33'],
    ['lua', '#000080'],
    ['makefile', '#427819'],
    ['markdown', '#083fa1'],
    ['matlab', '#bb92ac'],
    ['metal', '#8f14e9'],
    ['nginx', '#009639'],
    ['pascal', '#b0ce4e'],
    ['perl', '#0298c3'],
    ['prisma', '#0c344b'],
    ['postcss', '#dc3a0c'],
    ['php', '#4F5D95'],
    ['python', '#3572A5'],
    ['ruby', '#701516'],
    ['rust', '#dea584'],
    ['sass', '#a53b70'],
    ['scala', '#DC322F'],
    ['scss', '#c6538c'],
    ['shell', '#89e051'],
    ['svelte', '#ff3e00'],
    ['svg', '#ff9900'],
    ['swift', '#ffac45'],
    ['tsx', '#3178c6'],
    ['typescript', '#2b7489'],
    ['vim', '#199f4b'],
    ['vue', '#2c3e50'],
    ['webassembly', '#04133b'],
    ['xml', '#0060ac']
  ]),
  {
    get: (target, prop) => {
      switch (prop) {
        case 'get':
          return (lang: string) => {
            lang = lang.toLowerCase();
            return target.has(lang) ? target.get(lang) : '#083fa1';
          };
        default:
          return undefined;
      }
    }
  }
);
