let prevPath: string;

const routes = [
  'features',
  'index',
  'blog',
  'blog/*',
  'blog/*/*',
  'art',
  'art/*',
  'work',
  'work/*',
  'work/*/*',
  'about',
  'pgp'
];

const forward: string[] = [];
routes.forEach((route, index) => {
  index !== routes.length - 1 &&
    routes.forEach((subRoute, i) => {
      !(i <= index) && forward.push(`${route}-${subRoute}`);
    });
});

export const onNav = (path: string): 'forward' | 'backward' => {
  if (!path) {
    return 'forward';
  }

  const prev = prevPath ?? path;
  prevPath = path;

  const toRoute = path.startsWith('/')
    ? path
        .slice(1)
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/')
    : path
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/');
  const fromRoute = prev.startsWith('/')
    ? prev
        .slice(1)
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/')
    : prev
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/');

  const dirs = [
    fromRoute === '' ? 'index' : fromRoute,
    toRoute === '' ? 'index' : toRoute
  ].join('-');

  return forward.includes(dirs) ? 'forward' : 'backward';
};
