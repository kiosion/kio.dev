const stripTrailingSlash = (p: string) =>
  p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;

export const pathnameGroupKey = (pathname: string) => {
  // collapse tag routes into one group
  if (pathname === '/thoughts' || pathname.startsWith('/thoughts/+')) {
    return '/thoughts';
  }
  return pathname;
};

export const normalizePathname = (p?: string) => {
  if (!p) {
    return '/';
  }
  const base = stripTrailingSlash(p);
  return base || '/';
};
