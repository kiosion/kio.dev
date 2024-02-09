import { browser } from '$app/environment';
import { ERRORS } from '$lib/consts';
import Logger from '$lib/logger';

import { error } from '@sveltejs/kit';

const createGenericError = (message: string) => new Error(message);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Clean<T> = T extends Error ? never : T extends any[] ? CleanArray<T> : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CleanArray<T extends any[]> = {
  [P in keyof T]: Clean<T[P]>;
};

export const handleLoadError = <T>(data?: T | Error): Clean<T> => {
  if (!data) {
    throw error(500, {
      message: ERRORS.GENERIC_NO_DATA,
      stack: createGenericError(ERRORS.GENERIC_NO_DATA).stack
    });
  }

  if (data instanceof Error) {
    throw error((data as Error)?.code ?? 500, {
      message: data?.message || ERRORS.GENERIC_SOMETHING_WENT_WRONG,
      cause: data?.cause,
      stack: data?.stack || createGenericError(ERRORS.GENERIC_SOMETHING_WENT_WRONG).stack
    });
  }

  if (Array.isArray(data)) {
    const erroredData = data.filter((item) => item instanceof Error) as Error[];

    if (erroredData.length) {
      throw error((erroredData[0] as Error)?.code ?? 500, {
        message: erroredData[0]?.message || ERRORS.GENERIC_SOMETHING_WENT_WRONG,
        cause: erroredData[0]?.cause,
        stack:
          erroredData[0]?.stack ||
          createGenericError(ERRORS.GENERIC_SOMETHING_WENT_WRONG).stack
      });
    }
  }

  return data as Clean<T>;
};

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
