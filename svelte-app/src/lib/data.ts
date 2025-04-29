import { browser } from '$app/environment';
import Logger from '$lib/logger';

/*
 * Since Netlify has a timeout of 10s for any SSR function, we need to wrap
 * all SSR'd fetches in our own timeout block to abort and have the browser
 * handle fetching instead
 */
export const tryFetch = <T>(promise: Promise<T>, ms = 8000): Promise<T> => {
  if (browser) {
    return promise;
  }

  const timeout = new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      reject(new Error('Fetch timed out in SSR'));
    }, ms);
  });

  return Promise.race([timeout, promise]);
};

export const fetchRepoStats = async (fetch: typeof window.fetch, githubUrl?: string) => {
  try {
    const repo = githubUrl?.split('github.com/')?.[1];

    if (!repo?.length) {
      return { stars: 0, watchers: 0 };
    }

    const res = await fetch(`https://api.github.com/repos/${repo}`),
      json = await res.json(),
      stars = (json?.stargazers_count as number | undefined) ?? 0,
      watchers = (json?.subscribers_count as number | undefined) ?? 0;

    return { stars, watchers };
  } catch (e) {
    Logger.error('Failed to fetch stars for project', e);
    return { stars: 0, watchers: 0 };
  }
};
