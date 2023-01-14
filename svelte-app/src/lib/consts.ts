export const LOG_DIR = '$logs';

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

export const COLOR_TEXT_LIGHT = '#1E293B';
export const COLOR_TEXT_DARK = '#F1F5F9';
export const COLOR_BG_LIGHT = '#F1F5F9';
export const COLOR_BG_DARK = '#1E293B';

export const APP_LANGS = ['en', 'fr'];
export const DEFAULT_APP_LANG = 'en';

interface AppRoute {
  name: string;
  path: string;
  children?: AppRoute[];
  hidden?: boolean;
}

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
  },
  {
    name: 'PGP',
    path: '/pgp',
    hidden: true
  }
] as AppRoute[];

export const TOP_LEVEL_ROUTES = APP_ROUTES.map((r) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children: _children, ...rest } = r;
  return rest;
}) as Omit<AppRoute, 'children'>[];

export const BASE_TRANSITION_DURATION = 200;
export const BASE_ANIMATION_DURATION = 300;

export const PAGINATION_POSTS_PER_PAGE = 12;
export const PAGINATION_PROJECTS_PER_PAGE = 12;

// Disable pagination for now
export const RECENT_POSTS_COUNT = 99;
export const RECENT_PROJECTS_COUNT = 99;

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

export const LANGUAGE_COLOURS = new Proxy(
  new Map([
    ['arduino', '#bd79d1'],
    ['asp', '#6a40fd'],
    ['basic', '#ff0000'],
    ['brainfuck', '#2F2530'],
    ['c', '#555555'],
    ['c#', '#178600'],
    ['c++', '#f34b7d'],
    ['css', '#563d7c'],
    ['clojure', '#db5855'],
    ['coffeescript', '#244776'],
    ['diff', '#88dddd'],
    ['dockerfile', '#384d54'],
    ['ejs', '#a91e50'],
    ['elixir', '#6e4a7e'],
    ['emacs lisp', '#c065db'],
    ['emberscript', '#FFF4F3'],
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
    ['plsql', '#dad8d8'],
    ['python', '#3572A5'],
    ['rrlang', '#B83998'],
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
