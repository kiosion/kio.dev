export const LOG_DIR = '$logs';

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

export const COLOR_TEXT_LIGHT = '#1E293B';
export const COLOR_TEXT_DARK = '#F1F5F9';
export const COLOR_BG_LIGHT = '#F1F5F9';
export const COLOR_BG_DARK = '#1E293B';

export const TOP_LEVEL_ROUTES = [
  { name: 'Index', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'Work', path: '/work' },
  { name: 'About', path: '/about' }
];

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

export const PAGINATION_POSTS_PER_PAGE = 6;
export const RECENT_POSTS_COUNT = 5;
export const RECENT_PROJECTS_COUNT = 5;
